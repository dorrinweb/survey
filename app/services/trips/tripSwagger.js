export default {
    "/trip/add": {
  "post": {

    "tags": [
          "Trips"
        ],
    "summary": "Add New Trips",
    "description": "Add multiple trips for a user in a single request. The `x-token` is required in the header for authentication, and the `userId` is required in the request body to specify the passenger. The trips array should contain individual trip details.",
    "produces": [
      "application/json"
    ],
    "parameters": [
      {
        "name": "x-token",
        "in": "header",
        "description": "Authentication token for the user making the request",
        "required": true,
        "type": "string"
      },
      {
        "name": "body",
        "in": "body",
        "description": "Request body containing userId and trips array",
        "required": true,
        "schema": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "description": "ID of the user (passenger) for whom the trips are being added",
              "example": "64b6a9c5e4b0c1f9c7d3e2b2"
            },
            "trips": {
              "type": "array",
              "description": "Array of trip details",
              "items": {
                "type": "object",
                "properties": {
                  "departure": {
                    "type": "object",
                    "description": "Departure details of the trip (only required for the first trip)",
                    "properties": {
                      "time": {
                        "type": "object",
                        "description": "Departure time details",
                        "properties": {
                          "hour": {
                            "type": "integer",
                            "description": "Hour of departure",
                            "example": 8
                          },
                          "minute": {
                            "type": "integer",
                            "description": "Minute of departure",
                            "example": 30
                          },
                          "period": {
                            "type": "string",
                            "description": "Time period (morning/evening)",
                            "enum": ["صبح", "عصر"],
                            "example": "صبح"
                          }
                        }
                      },
                      "location": {
                        "type": "string",
                        "description": "Departure location",
                        "example": "محله الف، خیابان اصلی، میدان آزادی"
                      }
                    }
                  },
                  "destination": {
                    "type": "object",
                    "description": "Destination details of the trip",
                    "properties": {
                      "time": {
                        "type": "object",
                        "description": "Arrival time details",
                        "properties": {
                          "hour": {
                            "type": "integer",
                            "description": "Hour of arrival",
                            "example": 9
                          },
                          "minute": {
                            "type": "integer",
                            "description": "Minute of arrival",
                            "example": 15
                          },
                          "period": {
                            "type": "string",
                            "description": "Time period (morning/evening)",
                            "enum": ["صبح", "عصر"],
                            "example": "صبح"
                          }
                        }
                      },
                      "location": {
                        "type": "string",
                        "description": "Destination location",
                        "example": "محله ب، خیابان دوم، میدان انقلاب"
                      }
                    }
                  },
                  "purpose": {
                    "type": "string",
                    "description": "Purpose of the trip",
                    "enum": [
                      "تغییر وسیله (از تاکسی یا اتوبوس به مترو)",
                      "دیدار دوستان و نزدیکان",
                      "همراهی دوستان و نزدیکان",
                      "مراجعه به ادارات",
                      "خرید خدمات",
                      "خرید کالا",
                      "تحصیل",
                      "تفریح و ورزش",
                      "بازگشت به خانه",
                      "کار",
                      "سایر"
                    ],
                    "example": "بازگشت به خانه"
                  },
                  "transportationMode": {
                    "type": "string",
                    "description": "Mode of transportation used during the trip",
                    "enum": [
                      "خودروی شخصی راننده (من)",
                      "خودروی شخصی راننده (همراه)",
                      "تاکسی اینترنتی (سواری)",
                      "تاکسی خطی (سواری)",
                      "اتوبوس تندرو (BRT)",
                      "اتوبوس واحد",
                      "مینی‌بوس",
                      "وانت",
                      "کامیون",
                      "موتور سیکلت",
                      "دوچرخه",
                      "پیاده",
                      "قطار شهری",
                      "قطار",
                      "وسایل نقلیه عمومی دیگر",
                      "سرویس مدرسه (سواری)",
                      "سرویس مدرسه (مینی‌بوس)",
                      "سرویس مدرسه (اتوبوس)"
                    ],
                    "example": "اتوبوس واحد"
                  },
                  "parking": {
                    "type": "string",
                    "description": "Parking location",
                    "enum": [
                      "در کنار خیابان",
                      "پارکینگ شخصی",
                      "پارکینگ عمومی",
                      "پارکینگ محل کار"
                    ],
                    "example": "پارکینگ عمومی"
                  },
                  "parkingFee": {
                    "type": "integer",
                    "description": "Parking fee in Toman",
                    "example": 5000
                  },
                  "tripFee": {
                    "type": "integer",
                    "description": "Trip fee in Toman",
                    "example": 20000
                  }
                }
              }
            }
          }
        }
      }
    ],
    "responses": {
      "200": {
        "description": "Trips added successfully",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": 0
            },
            "msg": {
              "type": "string",
              "example": "successfuly_add"
            },
            "data": {
              "type": "object",
              "properties": {
                "duplicatedTrips": {
                  "type": "array",
                  "description": "Array of duplicate trips that were not added",
                  "items": {
                    "type": "object",
                    "description": "Duplicate trip"
                  }
                },
                "newTrips": {
                  "type": "array",
                  "description": "Array of new trips that were added",
                  "items": {
                    "type": "object",
                    "description": "Newly added trip"
                  }
                }
              }
            },
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      },
      "400": {
        "description": "Invalid request data",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": 3
            },
            "msg": {
              "type": "string",
              "example": "trips_data_is_invalid"
            },
            "isAuth": {
              "type": "integer",
              "example": 0
            }
          }
        }
      },
      "500": {
        "description": "Failed to add trips",
        "schema": {
          "type": "object",
          "properties": {
            "code": {
              "type": "integer",
              "example": -1
            },
            "msg": {
              "type": "string",
              "example": "add_record_faild"
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
    "/trip/user-trips/{id}": {
    "get": {
      "tags": [
          "Trips"
        ],
      "summary": "user Trips Index",
      "description": "List Of user Trips",
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
          "name": "id",
          "in": "path",
          "description": "user id",
          "required": true,
          "type": "string"
        }
      ],
      "responses": {
        "200": {
          "description": "successful",
        },
      },
    },
  },

  // "/trip/view/{id}": {
  //   "get": {
  //     "trips": [
  //       "Trip"
  //     ],
  //     "summary": "View Trip by id or trip title ",
  //     "description": "View Trip by id or tripTitle",
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
  //         "description": "trip id  or tripTitle",
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

  // "/trip/edit/{id}": {
  //   "patch": {
  //     "trips": [
  //       "Trip"
  //     ],
  //     "summary": "Edit Trip By tripTitle",
  //     "description": "Edit Trip By id or tripTitle",
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
  //         "description": "trip id  or tripCode",
  //         "required": true,
  //         "type": "string"
  //       },
  //       {
  //         "name": "title",
  //         "in": "formData",
  //         "description": "title of trip",
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