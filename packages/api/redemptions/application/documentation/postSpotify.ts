/*      
    #swagger.start

    #swagger.tags = ['Member']
    #swagger.path = '/online/single-use/custom/spotify'
    #swagger.method = 'post'
    #swagger.operationId = 'postSpotify'
    #swagger.description = 'Generate Spotify URL and Code'
    #swagger.summary = 'Create Spotify Code'
    #swagger.produces = ['application/json']

    #swagger.security = [{
      "OAuth2": []
    }]

    #swagger.requestBody = {
      "content": {
        "application/json": {
          "example": {
            "platform": "BLC",  
            "companyId": 23633,
            "offerId": 23266,
            "memberId": "3673374",
            "url": "https://www.spotify.com/uk/ppt/bluelightcard/?code=!!!CODE!!"
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
              "trackingUrl": "https://www.spotify.com/uk/ppt/bluelightcard/?code=1kTest-808",
              "code": "1kTest-808",
              "dwh": true
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
