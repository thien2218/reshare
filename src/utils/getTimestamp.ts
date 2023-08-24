export const getTimestamp = () => {
   const now = new Date();
   now.setMilliseconds(0);
   return now.toISOString().replace(".000", "");
};
