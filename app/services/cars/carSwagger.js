export default {
    "/car/add": {
        "post": {
          "tags": [
            "Car"
          ],
          "summary": "Add New Car",
          "description": "Add New Car",
          "produces": [
            "application/json"
          ],
          "parameters": [
            {
              "name": "userId",
              "in": "formData",
              "description": "requester userId (This field is temporary and will be deleted after implementing user authentication and tokenization.)",
              "required": true,
              "type": "string"
            },   
            {
              "name": "title",
              "in": "formData",
              "description": "title of car",
              "required": true,
              "type": "string"
            },       
            {
              "name": "description",
              "in": "formData",
              "description": "description",
              "required": false,
              "type": "string"
            },
            
            {
              "name": "carClass",
              "in": "formData",
              "description": "carClass",
              "required": false,
              "type": "string"
            },
            
            {
              "name": "subject",
              "in": "formData",
              "description": "subject",
              "required": false,
              "enum": [
                    "حقوقی",
                    "مدنی",
                    "کیفری",
                    "اداری",
                    "تجاری",
                    "ثبتی",
                    "رقابت",
                    "بین‌المللی",
                    "کار و کارگر",
                    "مالیاتی",
                    "داوری"
                ],
              "type": "string"
            },
            {
              "name": "status",
              "in": "formData",
              "description": "status",
              "required": false,
              "enum": [
                "تحقیقات",
                "رسیدگی بدوی",
                "صدور رأی بدوی و پیش از قطعیت",
                "رسیدگی تجدیدنظر",
                "مختومه",
                "رسیدگی دیوان عالی",
                "اجرای حکم",
            ],
              "type": "string"
            },
            {
              "name": "reference",
              "in": "formData",
              "description": "reference",
              "required": false,
              "type": "string"
            },
            {
              "name": "clientsName",
              "in": "formData",
              "description": "clientsName",
              "required": true,
              "type": "array",
              "items": {
                "type": "string"
              },
            },
            // {
            //   "name": "date",
            //   "in": "formData",
            //   "description": "date of car",
            //   "required": false,
            //   "type": "string",
            //   "format": "date",
            // },

            
          ],
          "responses": {
            "200": {
              "description": "successful",
            },
          },
        },
      },

    "/car/my-Cars": {
    "get": {
      "tags": [
        "Car"
      ],
      "summary": "My Cars Index",
      "description": "List Of My Cars",
      "produces": [
        "application/json"
      ],
      "parameters": [
        
        {
          "name": "userId",
          "in": "query",
          "description": "requester userId (This field is temporary and will be deleted after implementing user authentication and tokenization.)",
          "required": true,
          "type": "string"
        },   
        {
          "name": "title",
          "in": "query",
          "description": "car title",
          "required": false,
          "type": "string"
        },
        {
          "name": "carClass",
          "in": "query",
          "description": "carClass",
          "required": false,
          "type": "string"
        },
        {
          "name": "carCode",
          "in": "query",
          "description": "Car code in our system",
          "required": false,
          "type": "string"
        },
        {
          "name": "subject",
          "in": "query",
          "description": "subject",
          "required": false,
          "enum": [
                "حقوقی",
                "مدنی",
                "کیفری",
                "اداری",
                "تجاری",
                "ثبتی",
                "رقابت",
                "بین‌المللی",
                "کار و کارگر",
                "مالیاتی",
                "داوری"
            ],
          "type": "string"
        },
        {
          "name": "status",
          "in": "query",
          "description": "status",
          "required": false,
          "enum": [
            "تحقیقات",
            "رسیدگی بدوی",
            "صدور رأی بدوی و پیش از قطعیت",
            "رسیدگی تجدیدنظر",
            "مختومه",
            "رسیدگی دیوان عالی",
            "اجرای حکم",
        ],
          "type": "string"
        },
        {
          "name": "reference",
          "in": "query",
          "description": "reference",
          "required": false,
          "type": "string"
        },
        {
          "name": "clientsName",
          "in": "query",
          "description": "clientsName",
          "required": false,
          "type": "array",
          "items": {
            "type": "string"
          },
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
            'reference',
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

  "/car/view/{id}": {
    "get": {
      "tags": [
        "Car"
      ],
      "summary": "View Car by id or Car code ",
      "description": "View Car by id or carCode",
      "produces": [
        "application/json"
      ],
      "parameters": [
        {
          "name": "userId",
          "in": "query",
          "description": "requester userId (This field is temporary and will be deleted after implementing user authentication and tokenization.)",
          "required": true,
          "type": "string"
        }, 
        {
          "name": "id",
          "in": "path",
          "description": "car id  or carCode",
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

  "/car/edit/{id}": {
    "patch": {
      "tags": [
        "Car"
      ],
      "summary": "Edit Car By carCode",
      "description": "Edit car By carCode",
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
          "description": "car id  or carCode",
          "required": true,
          "type": "string"
        },
        {
          "name": "title",
          "in": "formData",
          "description": "title of car",
          "required": false,
          "type": "string"
        },       
        {
          "name": "description",
          "in": "formData",
          "description": "description",
          "required": false,
          "type": "string"
        },
        
        {
          "name": "carClass",
          "in": "formData",
          "description": "carClass",
          "required": false,
          "type": "string"
        },
        
        {
          "name": "subject",
          "in": "formData",
          "description": "subject",
          "required": false,
          "enum": [
                "حقوقی",
                "مدنی",
                "کیفری",
                "اداری",
                "تجاری",
                "ثبتی",
                "رقابت",
                "بین‌المللی",
                "کار و کارگر",
                "مالیاتی",
                "داوری"
            ],
          "type": "string"
        },
        {
          "name": "status",
          "in": "formData",
          "description": "status",
          "required": false,
          "enum": [
            "تحقیقات",
            "رسیدگی بدوی",
            "صدور رأی بدوی و پیش از قطعیت",
            "رسیدگی تجدیدنظر",
            "مختومه",
            "رسیدگی دیوان عالی",
            "اجرای حکم",
        ],
          "type": "string"
        },
        {
          "name": "reference",
          "in": "formData",
          "description": "reference",
          "required": false,
          "type": "string"
        },
        {
          "name": "clientsName",
          "in": "formData",
          "description": "clientsName",
          "required": false,
          "type": "array",
          "items": {
            "type": "string"
          },
        },
      ],
      "responses": {
        "200": {
          "description": "successful",
        },
      },
    },
  },

};