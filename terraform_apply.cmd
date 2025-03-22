terraform apply -auto-approve
terraform output -json > terraform_output.json
copy terraform_output.json frontend\terraform.config
copy terraform_output.json backend\terraform.config