# 100105-DowellApiKeySystme

**The Voucher System**

- I should be able to create a voucher using the name and the discount amount of the voucher.
- When we generate a voucher, all the older vouchers have to be set to `"is_active": False`. Only one voucher can be active at once.

**The Redeem Voucher System**

- To redeem a voucher, we need the username and email from the user.
- The combination of email and name cannot redeem the voucher again.
- When saving to the database, you have to save the following data:

```json
{
  "name",
  "email",
  "voucher_code",
  "voucher_discount",
  "created_on"
}
```

**The Generate Key System**

- A person can generate only one API key.
- The uniqueness will be determined by the combination of `workspaceID`, `email`, `userID`, and `username` (all of which will come from the frontend).
- When creating the key, if a user is providing a voucher that has been redeemed by them, show the credits as the "voucher_discount" (e.g., if the voucher has a discount of 100, then the credits would be 100).
- The user cannot create the key again with the same combination of `workspaceID`, `email`, `userID`, and `username`.
- Initially, the `paid` field will be set to false.
- Payment will be handled later.
- Don't use mail api right now.
- To save into the database:

```json
{
    "name",
    "email",
    "api_services",
    "is_active",
    "credits",
    "is_paid",
    "workspace_id",
    "user_id",
    "userDetails(as a JSON field)"
}
```

**The Process System**

- The purpose of this API is to reduce the count of credits on each API hit.
- For example, if a user hits any of the API services, the product people or API service provider will hit this API before providing their results.
- This API will take the API key and API services as input.

How to handle this:

- Check if the API key is present or not.
- Check the remaining credits.
- Check if the API services are active or not.
- Reduce the credit count (e.g., from 100 to 99) and update it in the API key table against that API "credits".
