const today = new Date();

function addDays(days: number) {
  return new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
}

export const data = [
  {
    id: 1,
    service: "DMP",
    invoice_id: 81,
    date: today,
    amount: 100,
    status: "paid",
  },
  {
    id: 2,
    service: "Exchange",
    invoice_id: 12,
    date: addDays(4),
    amount: 200,
    status: "pending",
  },
  {
    id: 3,
    service: "SSP",
    invoice_id: 223,
    date: addDays(41),
    amount: 300,
    status: "pending",
  },
  {
    id: 4,
    service: "Verification",
    invoice_id: 124,
    date: addDays(12),
    amount: 400,
    status: "paid",
  },
  {
    id: 5,
    service: "DSP",
    invoice_id: 325,
    date: addDays(121),
    amount: 500,
    status: "unpaid",
  },
  {
    id: 6,
    service: "DSP",
    invoice_id: 126,
    date: addDays(111),
    amount: 600,
    status: "paid",
  },
];

export const schema = {
  service: {
    name: "Service",
    type: "multiselect",
    ops: ["eq", "neq"],
    values: ["DMP", "Exchange", "SSP", "Verification", "DSP"],
  },
  date: {
    name: "Date",
    type: "datetime",
    ops: ["eq", "ne", "gt", "lt", "ge", "le"],
  },
  amount: {
    name: "Amount",
    type: "money",
    ops: ["eq", "ne", "gt", "lt", "ge", "le"],
  },
  status: {
    name: "Status",
    type: "multiselect",
    ops: ["eq", "neq"],
    values: ["Odendi", "Bekliyor", "Odenmedi"],
  },
};
