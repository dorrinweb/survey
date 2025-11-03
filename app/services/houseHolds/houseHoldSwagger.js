export default {

  "/household/add": {
    "post": {
      "tags": [
        "Household"
      ],
      "summary": "Add New Household",
      "description": "Add New Household",
      "produces": [
        "application/json"
      ],
      "parameters": [
        {
          "name": "x-token",
          "in": "header",
          "description": "userId, requester userId (This field is temporary and will be changed to user tocken after implementing user authentication and tokenization.)",
          "required": true,
          "type": "string"
        }, 
        {
          "name": "address",
          "in": "formData",
          "description": "address of Household",
          "required": true,
          "type": "string"
        },  
        {
          "name": "householdCount",
          "in": "formData",
          "description": "householdCount of Household",
          "required": true,
          "type": "number"
        },  
        {
          "name": "carCount",
          "in": "formData",
          "description": "carCount of Household",
          "required": true,
          "type": "number"
        },  
        {
          "name": "parkingSpacesCount",
          "in": "formData",
          "description": "parkingSpacesCount of Household",
          "required": true,
          "type": "number"
        },     
      ],
      "responses": {
        "200": {
          "description": "successful",
        },
      },
    },
  },

      "/household/index": {
        "get": {
          "tags": [
            "Household"
          ],
          "summary": "Add New Household",
          "description": "Add New Household",
          "produces": [
            "application/json"
          ],
          "parameters": [
            
          ],
          "responses": {
            "200": {
              "description": "successful",
            },
          },
        },
      },
};
