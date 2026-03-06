import cron from "node-cron";
import { User } from "../../DB/models/user.model.js";

// بيشتغل كل ساعة
cron.schedule("0 * * * *", async () => {
  const result = await User.deleteMany({
    isConfirmed: false,
    createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // أكتر من 24 ساعة
  });

  if (result.deletedCount > 0)
    console.log(`Cleanup: ${result.deletedCount} unverified user(s) deleted`);
});
