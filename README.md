# Celestia
Monolith backend for most Eglo functions and services.


# Route schemas


## /v1/authentication/login
```
email: z.string().email(),
password: z.string().min(5).max(50),
```
Response comes with token which must be set as a header for all other requests in the eglo_auth header



## /v1/authentication/register
```
name: z.string().min(2).max(50),
email: z.string().email(),
password_1: z.string().min(5).max(50),
password_2: z.string().min(5).max(50),
```
Passwords must match and response also comes with a token which also must be set in the same header as above


## /v1/devices/register
```
device_bluetooth_address: z.string().regex("/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/"),
device_last_reported_location_1_meter: z.string().min(10).max(400),
device_last_reported_location_5_meter: z.string().min(10).max(400),
device_type: z.string(), // desktop, laptop, phone, tablet, watch
device_os: z.string(), // windows, linux, mac, ios, watchos
device_model: z.string(), // manufacturer models
device_name: z.string().min(2).max(50),
preferred_device_contact: z.string().min(2).max(50), // bluetooth, gps
```
Bluetooth address is optional, or it will be soon as not all browsers support it and its hard to maintain. Location must be in GPS standard coordinates. Options for everything are shown and will be updated with RegEx



# Database schemas
Users
    id:
        device_owner_id

# JSON Testing
curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"username":"xyz","password":"xyz"}' \
    http://localhost:3000/api/login