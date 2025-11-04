export default {

  "/household/add": {
      "post": {
        "tags": [
          "Household"
        ],
        "summary": "Add New Household with Individuals",
        "description": "Add New Household and its Individuals",
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "x-token",
            "in": "header",
            "description": "userId, requester userId (This field is temporary and will be changed to user token after implementing user authentication and tokenization.)",
            "required": true,
            "type": "string"
          },
          {
            "name": "data",
            "in": "body",
            "description": "Household and Individuals data",
            "required": false,
            "schema": {
              "type": "object",
              "properties": {
                "householdData": {
                  "type": "object",
                  "properties": {
                    "address": {
                      "type": "string"
                    },
                    "householdCount": {
                      "type": "number"
                    },
                    "carCount": {
                      "type": "number"
                    },
                    "parkingSpacesCount": {
                      "type": "number"
                    }
                  },
                  "required": ["address", "householdCount", "carCount", "parkingSpacesCount"]
                },
                "individuals": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "gender": {
                        "type": "string",
                        "enum": ["زن", "مرد"]
                      },
                      "hasDrivingLicense": {
                        "type": "boolean"
                      },
                      "hasCarOwnership": {
                        "type": "boolean"
                      },
                      "relationWithHouseHold": {
                        "type": "string",
                        "enum": ["پدر", "مادر", "پسر", "دختر", "other"]
                      },
                      "customRelation": {
                        "type": "string"
                      },
                      "education": {
                        "type": "string",
                        "enum": ["بی‌سواد", "ابتدایی", "سیکل", "دیپلم", "فوق دیپلم", "لیسانس", "فوق لیسانس", "دکترا"]
                      },
                      "job": {
                        "type": "string",
                        "enum": [
                          "نیروی نظامی انتظامی",
                          "کارمند",
                          "کارگر ساده",
                          "کارگر ماهر",
                          "معلم/استاد/محقق/دانشمند",
                          "کاسب/تاجر/صاحب مشاغل",
                          "کشاورز/دامدار/شیلات",
                          "راننده وسایل نقلیه عمومی",
                          "استاد کار/کارگر مشاغل تولیدی",
                          "بیکار",
                          "محصل",
                          'خانه‌دار',  
                          "سایر"
                        ]
                      },
                      "workStartHour": {
                        "type": "object",
                        "properties": {
                          "hour": {
                            "type": "number"
                          },
                          "minute": {
                            "type": "number"
                          },
                          "period": {
                            "type": "string",
                            "enum": ["صبح", "عصر"]
                          }
                        }
                      },
                      "carDetails": {
                        "type": "object",
                        "properties": {
                          "carType": {
                            "type": "string",
                            "enum": ['سواری', 'وانت', 'کامیون', 'موتور سیکلت', 'اتوبوس', 'مینی‌بوس', 'تراکتور', 'کامیونت', 'سایر']
                          },
                          "carName": {
                            "type": "string"
                          },
                          "carYear": {
                            "type": "number"
                          },
                          "fuelType": {
                            "type": "string",
                            "enum": ["بنزینی", "گازوئیلی", "برقی", "گازسوز", "هیبریدی"]
                          }
                        }
                      },
                      "income": {
                        "type": "string"
                      },
                      "expenses": {
                        "type": "string"
                      }
                    },
                    "required": ["gender", "relationWithHouseHold", "education", "job"]
                  }
                }
              },
              "required": ["householdData", "individuals"]
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Household and individuals added successfully"
          },
          "400": {
            "description": "Invalid input data"
          }
        }
      }
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
