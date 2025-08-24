import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCOUNTS_KEY = "@accounts_data";
const DEFAULT_ICON =
  "https://notebook-covers.s3.us-west-2.amazonaws.com/92f17ac11682913ee5640c2c8c8b1dfc";

const cap = (s="") => s.charAt(0).toUpperCase() + s.slice(1);

export async function applyTxToAccounts(newTransaction) {
  // guard
  const amt = Number(newTransaction?.amount) || 0;
  if (!newTransaction?.account || amt <= 0) return;

  // read accounts array
  let accounts = [];
  try {
    const stored = await AsyncStorage.getItem(ACCOUNTS_KEY);
    if (stored) accounts = JSON.parse(stored);
  } catch (e) {
    console.log("Read accounts error:", e);
  }

  const accName = (newTransaction.account || "").trim().toLowerCase();
  let idx = accounts.findIndex(a => (a.name || "").trim().toLowerCase() === accName);

  // if account not found, create it
  if (idx === -1) {
    accounts.push({ name: cap(accName), balance: 0, imageUrl: DEFAULT_ICON });
    idx = accounts.length - 1;
  }

  // Only change totals if included
  if (newTransaction.isIncludedInTotal !== false) {
    const sign = (newTransaction.type || "").toLowerCase() === "income" ? 1 : -1;
    const newBal = (Number(accounts[idx].balance) || 0) + sign * amt;
    accounts[idx].balance = Number(newBal.toFixed(2));
  }

  // write back
  try {
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    // optional: return updated for UI
    console.log("Updated accounts:", accounts);
    return accounts;
  } catch (e) {
    console.log("Write accounts error:", e);
  }
}
