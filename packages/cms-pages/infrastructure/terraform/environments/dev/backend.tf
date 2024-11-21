terraform {
  cloud {

    organization = "bluelightcard"

    workspaces {
      name = "blc-mono-cms-pages-develop"
    }
  }
}
