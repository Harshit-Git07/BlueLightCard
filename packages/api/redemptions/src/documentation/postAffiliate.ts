/*      
    #swagger.start

    #swagger.tags = ['Member']
    #swagger.path = '/connection/affiliate'
    #swagger.method = 'post'
    #swagger.operationId = 'postAffiliate'
    #swagger.description = 'Generate affiliate tracking URL'
    #swagger.summary = 'Create tracking URL'
    #swagger.produces = ['application/json']

    #swagger.security = [{
      "OAuth2": []
    }]

    #swagger.requestBody = {
      "content": {
        "application/json": {
          "example": {
            "affiliateUrl": "https://www.awin1.com",
            "memberId": "1234"
          }
        }
      }
    }

    #swagger.responses[200] = {
      "description": "Success response",
      "content": {
        "application/json": {
          "example": {
            "message": "Success",
            "data": {
              "trackingUrl": "https://www.awin1.com/?clickref=1234"
            }
          }
        }
      }
    }

    #swagger.responses[401] = {
      "description": "Unauthorized",
      "content": {
        "application/json": {
          "example": {
            "message": "Unauthorized"
            }
          }
        }
      }
    }

    #swagger.responses[403] = {
      "description": "Forbidden",
      "content": {
        "application/json": {
          "example": {
            "message": "Forbidden"
            }
          }
        }
      }
    }
     
    #swagger.responses[500] = {
      "description": "Internal Server Error",
      "content": {
        "application/json": {
          "example": {
            "message": "Internal Server Error",
          }
        }
      }
    }

    #swagger.end
*/
