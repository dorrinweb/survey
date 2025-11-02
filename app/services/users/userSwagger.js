export default {
    "/user/register": {
        "post": {
          "tags": [
            "Users"
          ],
          "summary": "Add New User",
          "description": "Add New User",
          "produces": [
            "application/json"
          ],
          "parameters": [
            {           
              
              "name": "phone",
              "in": "formData",
              "description": "mobile",
              "required": false,
              "type": "string"
            }, 
          ],
          "responses": {
            "200": {
              "description": "successful",
            },
          },
        },
      },

    "/user/get-password": {
    "post": {
      "tags": [
        "Users"
      ],
      "summary": "User Get Password",
      "description": "User Get Password",
      "produces": [
        "application/json"
      ],
      "parameters": [
        {
          "name": "phone",
          "in": "formData",
          "description": "phone",
          "required": false,
          "type": "string"
        },
      ],
      "responses": {
        "200": {
          "description": "successful",
        },
      },
    },
    },

  "/user/login": {
      "post": {
        "tags": [
          "Users"
        ],
        "summary": "User Login",
        "description": "User Login",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "phone",
            "in": "formData",
            "description": "phone",
            "required": false,
            "type": "string"
          },
          {
            "name": "password",
            "in": "formData",
            "description": "password",
            "required": false,
            "type": "string"
          },
          // {
          //   "name": "role",
          //   "in": "formData",
          //   "description": "login as role",
          //   "required": false,
          //   "enum": [
          //     "superAdmin",
          //     "teacher",
          //     "student",
          //   ],
          //   "type": "string"
          // },
        ],
        "responses": {
          "200": {
            "description": "successful",
          },
        },
      },
    },


      "/user/index": {
        "get": {
          "tags": [
            "Users"
          ],
          "summary": "Add New User",
          "description": "Add New User",
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
