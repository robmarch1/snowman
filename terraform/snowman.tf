provider "aws" {
  region = "eu-west-1"
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
}

# Populated from secret.auto.tfvars on Ethel
variable "access_key" {}

# Populated from secret.auto.tfvars on Ethel
variable "secret_key" {}

resource "aws_s3_bucket" "snowman" {
  bucket = "molyneux-snowman-2"
  region = "eu-west-1"
  acl = "public-read"

  website {
    index_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "global_read_permissions" {
  bucket = "${aws_s3_bucket.snowman.id}"

  policy = <<POLICY
{
  "Id": "Policy1542626285396",
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Action": [
        "s3:GetObject"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::molyneux-snowman-2/*",
      "Principal": "*"
    }
  ]
}
POLICY
}

resource "aws_s3_bucket_object" "home_page" {
  key = "index.html"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/index.html"
  content_type = "text/html"
}

resource "aws_s3_bucket_object" "favicon" {
  key = "favicon.ico"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/favicon.ico"
  content_type = "image/x-icon"
}

resource "aws_s3_bucket_object" "home_js" {
  key = "js/home.js"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/js/home.js"
  content_type = "text/javascript"
}

resource "aws_s3_bucket_object" "home_css" {
  key = "css/home.css"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/css/home.css"
  content_type = "text/css"
}

resource "aws_s3_bucket_object" "snowmap" {
  key = "js/snowmap.json"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/js/snowmap.json"
  content_type = "application/json"

  provisioner "local-exec" {
    command = "node ../generator/index"
  }
}

resource "aws_s3_bucket_object" "invitees" {
  key = "js/invitees.json"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/js/invitees.json"
  content_type = "application/json"

  depends_on = ["aws_s3_bucket_object.snowmap"]
}
