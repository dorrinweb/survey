export default {
  "/user/addUsersToHousehold": {
      "post": {
        "tags": [
          "Users"
        ],
        "summary": "Add New Users To Household",
        "description": "Add New Users",
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
                    "name": "householdId",
                    "in": "path",
                    "description": "householdId",
                    "required": true,
                    "type": "string"
                  }, 
          {
            "name": "gender",
            "in": "formData",
            "description": "gender",
            "required": false,
            "enum": [
                  'زن', 
                  'مرد'
              ],
            "type": "string"
          },
          {           
            
            "name": "birthYear",
            "in": "formData",
            "description": "birthYear",
            "required": false,
            "type": "string"
          }, 
          {           
            
            "name": "education",
            "in": "formData",
            "description": "education",
            "required": false,
            "enum": ['بی‌سواد', 'ابتدایی', 'سیکل', 'دیپلم', 'فوق دیپلم', 'لیسانس', 'فوق لیسانس', 'دکترا'], // Only specified options are allowed

            "type": "string"
          }, 
          {
            "name": "hasDrivingLicense",
            "in": "formData",
            "description": "hasDrivingLicense",
            "required": false,
            "enum": [
                  true, 
                  false
              ],
            "type": Boolean
          },
          {           
            
            "name": "workStartHour",
            "in": "formData",
            "description": "workStartHour workStartHour",
            "required": false,
            "type": "string"
          }, 
          {
            "name": "expenses",
            "in": "formData",
            "description": "expenses",
            "required": false,
            "enum": [
              '0-3',
              '3-6',
              '6-10',
              '10-15',
              'up 15'
          ],
            "type": "string"
          },
          {
            "name": "income",
            "in": "formData",
            "description": "income",
            "required": false,
            "enum": [
              '0-3',
              '3-6',
              '6-10',
              '10-15',
              'up 15'
          ],
            "type": "string"
          },
          {
            "name": "job",
            "in": "formData",
            "description": "job",
            "required": false,
            "enum": [
              'نیروی نظامی انتظامی',
              'کارمند',
              'کارگر ساده',
              'کارگر ماهر',
              'معلم/استاد/محقق/دانشمند',
              'کاسب/تاجر/صاحب مشاغل',
              'کشاورز/دامدار/شیلات',
              'راننده وسایل نقلیه عمومی',
              'استاد کار/کارگر مشاغل تولیدی',
              'بیکار',
              'محصل',
              'خانه‌دار',
              'سایر',
          ],
            "type": "string"
          },
          {
            "name": "relationWithHouseHold",
            "in": "formData",
            "description": "relationWithHouseHold",
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