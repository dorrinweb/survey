export default {
    "/tag/add": {
        "post": {
          "tags": [
            "Tag"
          ],
          "summary": "Add New Tag",
          "description": "Add New Tag",
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
              "name": "title",
              "in": "formData",
              "description": "title of tag",
              "required": true,
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

    "/tag/my-tags": {
    "get": {
      "tags": [
        "Tag"
      ],
      "summary": "My Tags Index",
      "description": "List Of My Tags",
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
          "name": "title",
          "in": "query",
          "description": "tag title",
          "required": false,
          "type": "string"
        },
        {
          "name": "sortType",
          "in": "query",
          "description": "sortType",
          "required": false,
          "enum": [
            "asc",
            "desc",
          ],
          "type": "string"
        },
        {
          "name": "sortField",
          "in": "query",
          "description": "sortField",
          "required": false,
          "enum": [
            '_id',
            'title',
            'createdAt',            
          ],
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

  // "/tag/view/{id}": {
  //   "get": {
  //     "tags": [
  //       "Tag"
  //     ],
  //     "summary": "View Tag by id or tag title ",
  //     "description": "View Tag by id or tagTitle",
  //     "produces": [
  //       "application/json"
  //     ],
  //     "parameters": [
  //       {
  //         "name": "x-token",
  //         "in": "header",
  //         "description": "userId, requester userId (This field is temporary and will be changed to user tocken after implementing user authentication and tokenization.)",
  //         "required": true,
  //         "type": "string"
  //       },
  //       {
  //         "name": "id",
  //         "in": "path",
  //         "description": "tag id  or tagTitle",
  //         "required": true,
  //         "type": "string"
  //       },
      
  //     ],
  //     "responses": {
  //       "200": {
  //         "description": "successful",
  //       },
  //     },
  //   },
  // },

  // "/tag/edit/{id}": {
  //   "patch": {
  //     "tags": [
  //       "Tag"
  //     ],
  //     "summary": "Edit Tag By tagTitle",
  //     "description": "Edit Tag By id or tagTitle",
  //     "produces": [
  //       "application/json"
  //     ],
  //     "parameters": [
  //       {
  //         "name": "x-token",
  //         "in": "header",
  //         "description": "userId, requester userId (This field is temporary and will be changed to user tocken after implementing user authentication and tokenization.)",
  //         "required": true,
  //         "type": "string"
  //       },
  //       {
  //         "name": "id",
  //         "in": "path",
  //         "description": "tag id  or tagCode",
  //         "required": true,
  //         "type": "string"
  //       },
  //       {
  //         "name": "title",
  //         "in": "formData",
  //         "description": "title of tag",
  //         "required": false,
  //         "type": "string"
  //       },        
  //     ],
  //     "responses": {
  //       "200": {
  //         "description": "successful",
  //       },
  //     },
  //   },
  // },

};