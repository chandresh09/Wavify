// Placeholder: there is no support API yet, so this sends nothing.
// When the endpoint exists, replace the body with:
//   const { data } = await api.post('/support', values);
//   return data;
export async function sendSupportMessage(values) {
  void values;
  return { sent: false };
}
