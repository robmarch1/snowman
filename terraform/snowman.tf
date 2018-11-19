# Use the Amazon Web Services data centre in Dublin to host the site
provider "aws" {
  region = "eu-west-1"
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
}

# Secret account credentials. Populated from secret.auto.tfvars on Ethel
variable "access_key" {}

# Secret account credentials. Populated from secret.auto.tfvars on Ethel
variable "secret_key" {}

# Create the file system to hold the files, and specify the homepage
resource "aws_s3_bucket" "snowman" {
  bucket = "molyneux-snowman-2"
  region = "eu-west-1"
  acl = "public-read"

  website {
    index_document = "index.html"
  }
}

# Set the permissions on the site so everyone can see it
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

# Copy the HTML file for the homepage into the site file system
resource "aws_s3_bucket_object" "home_page" {
  key = "index.html"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/index.html"
  content_type = "text/html"
}

# Copy the favicon into the site file system
resource "aws_s3_bucket_object" "favicon" {
  key = "favicon.ico"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/favicon.ico"
  content_type = "image/x-icon"
}

# Copy the homepage javascript into the site file system
resource "aws_s3_bucket_object" "home_js" {
  key = "js/home.js"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/js/home.js"
  content_type = "text/javascript"
}

# Copy the homepage stylesheet into the site file system
resource "aws_s3_bucket_object" "home_css" {
  key = "css/home.css"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/css/home.css"
  content_type = "text/css"
}

# Generate the list of who's buying for who and copy into the site file system
resource "aws_s3_bucket_object" "snowmap" {
  key = "js/snowmap.json"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/js/snowmap.json"
  content_type = "application/json"

  provisioner "local-exec" {
    command = "node ../generator/index"
  }
}

# Copy the file containing the list of invitees into the site file system
resource "aws_s3_bucket_object" "invitees" {
  key = "js/invitees.json"
  bucket = "${aws_s3_bucket.snowman.bucket}"
  source = "../site/js/invitees.json"
  content_type = "application/json"

  depends_on = ["aws_s3_bucket_object.snowmap"]
}
