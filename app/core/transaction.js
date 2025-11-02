class transaction {
    async coreAPI(client) {
        const session = client.startSession();
        try {
            session.startTransaction();

            /** ... perform operations
             * 
            */

            await session.commitTransaction();
            console.log("Transaction committed.");

        } catch (error) {
            console.log("An error occurred during the transaction:" + error);
            await session.abortTransaction();
        } finally {
            await session.endSession();
        }
    }

    async convAPI(client){
        
        let txnRes = await client.withSession(async (session) =>
            session.withTransaction(async (session)=> {
                
                /**  ... perform operations
                 * 
                */
                
                return "Transaction committed.";
            }, null)
        );

        console.log(txnRes);
    }

    // const txnResult = await client.withSession(async (session) =>
    //     session.withTransaction(async (session) => {
    //         const invColl = client.db("testdb").collection("inventory");
    //         const recColl = client.db("testdb").collection("orders");
      
    //         let total = 0;
    //         for (const item of order) {
    //           /* Update the inventory for the purchased items. End the
    //           transaction if the quantity of an item in the inventory is
    //           insufficient to complete the purchase. */
    //           const inStock = await invColl.findOneAndUpdate(
    //             {
    //               item: item.item,
    //               qty: { $gte: item.qty },
    //             },
    //             { $inc: { qty: -item.qty } },
    //             { session }
    //           );
    //           if (inStock === null) {
    //             await session.abortTransaction();
    //             return "Item not found or insufficient quantity.";
    //           }
    //           const subTotal = item.qty * inStock.price;
    //           total = total + subTotal;
    //         }
      
    //         // Create a record of the purchase
    //         const receipt = {
    //           date: new Date(),
    //           items: order,
    //           total: total,
    //         };
    //         await recColl.insertOne(receipt, { session });
    //         return (
    //           "Order successfully completed and recorded!\nReceipt:\n" +
    //           JSON.stringify(receipt, null, 1)
    //         );
    //       }, null)
    //       .finally(async () => await client.close())
    //   );
      
    //   console.log(txnResult);
}