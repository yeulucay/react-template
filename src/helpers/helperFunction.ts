import { InvoiceStatus } from "../enum/InvoiceStatus";
import { IInvoice } from "../interfaces/IInvoice";
import moment from "moment";

const iStatus = InvoiceStatus as any;

export class Helper {
  static monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  static getMonthName = (d: any) => {
    return Helper.monthNames[d.getMonth()];
  };

  static formatDate = (d: any) => {
    const dd = String(d.getDate()).padStart(2, "0");
    return `${Helper.getMonthName(d)} ${dd}, ${d.getFullYear()}`;
  };

  static getTheDateWithoutTime = (d: any) => {
    var date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  static getInvoicesForDateComp = (filter: any, invoices: IInvoice[]) => {
    return invoices.filter((invoice: any) => {
      const d1 = moment(invoice[filter.title]) as any;
      const d2 = filter.value as any;
      if (filter.condition === "eq") {
        if (d1.isSame(d2, "date")) {
          return invoice;
        }
      } else if (filter.condition === "ne") {
        if (!d1.isSame(d2, "date")) {
          return invoice;
        }
      } else if (filter.condition === "gt") {
        if (d1.diff(d2) > 0) {
          return invoice;
        }
      } else if (filter.condition === "lt") {
        if (d1.diff(d2) < 0) {
          return invoice;
        }
      } else if (filter.condition === "ge") {
        if (d1.diff(d2) >= 0) {
          return invoice;
        }
      } else if (filter.condition === "le") {
        if (d1.diff(d2) <= 0) {
          return invoice;
        }
      }
      return undefined;
    });
  };

  static filterInvoices = (invs: IInvoice[], f: any) => {
    let value = f.value;
    if (f.title === "status") {
      Object.keys(iStatus).forEach((status) => {
        if (value === iStatus[status]) {
          value = status;
        }
      });
    }
    if (f.title === "date") {
      invs = Helper.getInvoicesForDateComp(f, invs) as IInvoice[];
    } else {
      if (f.condition === "eq") {
        invs = invs.filter((invoice: any) => invoice[f.title] === value);
      } else if (f.condition === "neq") {
        invs = invs.filter((invoice: any) => invoice[f.title] !== value);
      } else if (f.condition === "ne") {
        invs = invs.filter((invoice: any) => invoice[f.title] !== value);
      } else if (f.condition === "gt") {
        invs = invs.filter((invoice: any) => invoice[f.title] > value);
      } else if (f.condition === "lt") {
        invs = invs.filter((invoice: any) => invoice[f.title] < value);
      } else if (f.condition === "ge") {
        invs = invs.filter((invoice: any) => invoice[f.title] >= value);
      } else if (f.condition === "le") {
        invs = invs.filter((invoice: any) => invoice[f.title] <= value);
      }
    }
    return invs;
  };

  static getCondName = (value: string) => {
    switch (value) {
      case "eq":
        return "=";
      case "neq":
        return "!=";
      case "ne":
        return "!=";
      case "gt":
        return ">";
      case "lt":
        return "<";
      case "ge":
        return ">=";
      case "le":
        return "<=";
    }
    return "";
  };
}
