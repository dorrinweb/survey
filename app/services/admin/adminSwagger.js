export default {


  "/admin/get-stats": {
  
  "get": {
    "tags": [
        "Admin"
      ],
    "summary": "Get Statistics",
    "description": "Returns a paginated list of households. Accepts `page` and `limit` as query parameters.",
    "produces": [
      "application/json"
    ],
    "parameters": [
      {
        "name": "x-token",
        "in": "header",
        "description": "Authentication token",
        "required": true,
        "type": "string"
      },
      
    ],
    "responses": {
      "200": {
        "description": "List of households",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": 0
            },
            "data": {
              "type": "array",
              "items": {
                "type": "object"
              }
            },
          
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      },
      "404": {
        "description": "No household records found",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": 9
            },
            "msg": {
              "type": "string",
              "example": "houseHold.not_found"
            },
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      },
      "500": {
        "description": "Server error",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": -1
            },
            "msg": {
              "type": "string",
              "example": "internal_server_error"
            },
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      }
    }
  }
  },
"/admin/get-users": {
  
  "get": {
    "tags": [
        "Admin"
      ],
    "summary": "Get Statistics",
    "description": "Returns a paginated list of households. Accepts `page` and `limit` as query parameters.",
    "produces": [
      "application/json"
    ],
    "parameters": [
      {
        "name": "x-token",
        "in": "header",
        "description": "Authentication token",
        "required": true,
        "type": "string"
      },
      
    ],
    "responses": {
      "200": {
        "description": "List of households",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": 0
            },
            "data": {
              "type": "array",
              "items": {
                "type": "object"
              }
            },
          
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      },
      "404": {
        "description": "No household records found",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": 9
            },
            "msg": {
              "type": "string",
              "example": "houseHold.not_found"
            },
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      },
      "500": {
        "description": "Server error",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": -1
            },
            "msg": {
              "type": "string",
              "example": "internal_server_error"
            },
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      }
    }
  }
  },
  "/admin/get-households": {
  
  "get": {
    "tags": [
        "Admin"
      ],
    "summary": "Get Statistics",
    "description": "Returns a paginated list of households. Accepts `page` and `limit` as query parameters.",
    "produces": [
      "application/json"
    ],
    "parameters": [
      {
        "name": "x-token",
        "in": "header",
        "description": "Authentication token",
        "required": true,
        "type": "string"
      },
      
    ],
    "responses": {
      "200": {
        "description": "List of households",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": 0
            },
            "data": {
              "type": "array",
              "items": {
                "type": "object"
              }
            },
          
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      },
      "404": {
        "description": "No household records found",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": 9
            },
            "msg": {
              "type": "string",
              "example": "houseHold.not_found"
            },
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      },
      "500": {
        "description": "Server error",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": -1
            },
            "msg": {
              "type": "string",
              "example": "internal_server_error"
            },
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      }
    }
  }
  },
  "/admin/get-trips": {
  
  "get": {
    "tags": [
        "Admin"
      ],
    "summary": "Get Statistics",
    "description": "Returns a paginated list of households. Accepts `page` and `limit` as query parameters.",
    "produces": [
      "application/json"
    ],
    "parameters": [
      {
        "name": "x-token",
        "in": "header",
        "description": "Authentication token",
        "required": true,
        "type": "string"
      },
      
    ],
    "responses": {
      "200": {
        "description": "List of households",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": 0
            },
            "data": {
              "type": "array",
              "items": {
                "type": "object"
              }
            },
          
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      },
      "404": {
        "description": "No household records found",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": 9
            },
            "msg": {
              "type": "string",
              "example": "houseHold.not_found"
            },
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      },
      "500": {
        "description": "Server error",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": -1
            },
            "msg": {
              "type": "string",
              "example": "internal_server_error"
            },
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      }
    }
  }
  }


};
