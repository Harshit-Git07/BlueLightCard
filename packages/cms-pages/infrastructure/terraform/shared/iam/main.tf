# ======================================================================================
# Basic execution role for Amplify
# ======================================================================================

data "aws_iam_policy" "amplify_service_policy" {
  arn = "arn:aws:iam::aws:policy/service-role/AmplifyBackendDeployFullAccess"
}

resource "aws_iam_role" "amplify_exec" {
  name = "amplify_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = ["amplify.amazonaws.com", "amplify.eu-west-2.amazonaws.com"]
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "amplify_policy" {
  role       = aws_iam_role.amplify_exec.name
  policy_arn = "${data.aws_iam_policy.amplify_service_policy.arn}"
}



