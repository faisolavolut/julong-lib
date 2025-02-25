"use client";
import { get_user } from "./get_user";

export const showApprovel = (
  data: any,
  permision: string[],
  action?: "approve" | "reject"
) => {
  if (!permision?.length) {
    return null;
  }
  const a1 = [
    {
      status: "IN PROGRESS",
      permision: ["approval-mpr-dept-head"],
      column: ["department_head"],
      level: ["Level Head Department"],
    },
    {
      status: "NEED APPROVAL",
      permision: [
        "approval-mpr-dept-head",
        "approval-mpr-vp",
        "approval-mpr-ceo",
      ],
      column: ["department_head", "vp_gm_director", "ceo"],
      level: ["Level Head Department", "Level VP", "Level CEO"],
    },
    {
      status: "APPROVED",
      permision: ["approval-mpr-ho"],
      column: ["hrd_ho_unit"],
      level: ["Level HRD HO"],
    },
  ];
  const role = {
    head: permision.find((e) => e === "approval-mpr-dept-head"),
    dir: permision.find((e) => e === "approval-mpr-vp"),
    ceo: permision.find((e) => e === "approval-mpr-ceo"),
    ho_unit: permision.find((e) => e === "approval-mpr-ho"),
  };
  const isBudget = data?.mp_planning_header_id ? true : false;
  const isField = data?.organization_category === "Non Field" ? false : true;
  if (data?.status === "NEED APPROVAL") {
    if (data?.department_head && !data?.vp_gm_director) {
      return {
        approve:
          action === "reject"
            ? "REJECTED"
            : isField
            ? "APPROVED"
            : "NEED APPROVAL",
        level: "Level VP",
      };
    } else if (data?.vp_gm_director && !data?.ceo) {
      return null;
      return {
        approve: action === "reject" ? "REJECTED" : "APPROVED",
        level: "Level VP",
      };
    }
  } else if (data?.status === "IN PROGRESS") {
    console.log(data?.requestor_id, get_user("employee.id"));
    const isYou = data?.requestor_id === get_user("employee.id");
    if (role?.head)
      return {
        approve:
          action === "reject"
            ? "REJECTED"
            : isBudget
            ? "APPROVED"
            : "NEED APPROVAL",
        level: "Level Head Department",
      };
    if (isYou) {
      return {
        approve:
          action === "reject"
            ? "REJECTED"
            : isBudget
            ? "APPROVED"
            : "NEED APPROVAL",
        level: "Level Head Department",
      };
    }
    return null;
  } else if (data?.status === "APPROVED") {
    if (role?.head) {
      return null;
    }
    console.log({ role });
    if (isBudget) {
      if (!data?.hrd_ho_unit_name) {
        return {
          approve: action === "reject" ? "REJECTED" : "COMPLETED",
          level: "Level HRD HO",
        };
      }
    } else {
      if (data?.department_head && !data?.vp_gm_director) {
        return {
          approve:
            action === "reject"
              ? "REJECTED"
              : isField
              ? "APPROVED"
              : "NEED APPROVAL",
          level: "Level VP",
        };
      } else if (!data?.hrd_ho_unit) {
        return {
          approve: action === "reject" ? "REJECTED" : "COMPLETED",
          level: "Level HRD HO",
        };
      }
    }
  }
  return null;
};
