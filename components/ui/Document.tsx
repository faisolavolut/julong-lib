"use client";
import { FC } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";
Font.register({
  family: "Noto Sans SC",
  src: `${process.env.NEXT_PUBLIC_BASE_URL}/NotoSerifSC-Regular.ttf`,
});
Font.register({
  family: "roboto",
  src: `${process.env.NEXT_PUBLIC_BASE_URL}/Roboto-Medium.ttf`,
});
Font.register({
  family: "roboto-light",
  src: `${process.env.NEXT_PUBLIC_BASE_URL}/Roboto-Light.ttf`,
});
// Create styles
const styles = StyleSheet.create({
  chinese: {
    fontFamily: "Noto Sans SC", // Font Chinese
    fontSize: 10,
  },
  page: {
    padding: 20,
    fontFamily: "roboto",
    fontSize: 10,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },

  thead: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    marginBottom: 10,
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    padding: 5,
    flex: 1,
  },
  bold: {
    fontWeight: "bold",
  },

  image: {
    height: 40, // Atur tinggi gambar
    marginBottom: 10,
    alignSelf: "center",
  },
});
const Row: FC<{
  col1?: string;
  col2?: string;
  col3?: string;
  col4?: string;
  col5?: string;
  style?: Style;
  styleText?: Style;
  footer?: boolean;
  hideBorder?: boolean;
}> = ({
  col1,
  col2,
  col3,
  col4,
  col5,
  style,
  styleText,
  footer,
  hideBorder,
}) => {
  return (
    <View
      style={{
        borderColor: "black",
        display: "flex",
        flexDirection: "row",
        width: "100%",
        ...style,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderRight: 1,
          flexGrow: 1,
          borderColor: "black",
          justifyContent: footer ? "flex-end" : "flex-start",
          borderBottom: 0,
          padding: 5,
        }}
      >
        {col1 && <Text style={styleText}>{col1}</Text>}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: 100,
          borderRight: 1,
          borderColor: "black",
          borderTop: footer && !hideBorder ? 1 : 0,
          borderBottom: footer && !hideBorder ? 1 : 0,
        }}
      >
        {col2 && <Text style={styleText}>{col2}</Text>}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          width: 99.5,
          borderRight: 1,
          borderTop: footer && !hideBorder ? 1 : 0,
          borderBottom: footer && !hideBorder ? 1 : 0,
        }}
      >
        {col3 && <Text style={styleText}>{col3}</Text>}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 100.5,
          borderRight: 1,
          borderColor: "black",
          borderTop: footer && !hideBorder ? 1 : 0,
          borderBottom: footer && !hideBorder ? 1 : 0,
        }}
      >
        {col4 && <Text style={styleText}>{col4}</Text>}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderColor: "black",
          width: 100,
          borderTop: footer && !hideBorder ? 1 : 0,
          borderBottom: footer && !hideBorder ? 1 : 0,
        }}
      >
        {col5 && <Text style={styleText}>{col5}</Text>}
      </View>
    </View>
  );
};
// Create Document Component
const convertRawData = (data: any): any[] => {
  const formatGradeData = (grade: any): any[] => {
    const exec = grade?.executive || [];
    const non = grade?.non_executive || [];

    const calculateSubTotal = (items: any[]): any => {
      return {
        existing: items.reduce((sum, item) => sum + (item?.existing || 0), 0),
        promote: items.reduce((sum, item) => sum + (item?.promote || 0), 0),
        recruit: items.reduce((sum, item) => sum + (item?.recruit || 0), 0),
        total: items.reduce((sum, item) => sum + (item?.total || 0), 0),
      };
    };

    const subTotalExecutive = calculateSubTotal(exec);
    const subTotalNon = calculateSubTotal(non);

    const rows: any[] = [];

    const addRowData = (label: string, data: any[], subTotal: any): void => {
      rows.push({ col1: label });
      data.forEach((e) => {
        rows.push({
          col1: e?.job_level_name,
          col2: e?.existing,
          col3: e?.promote,
          col4: e?.recruit,
          col5: e?.total,
        });
      });
      rows.push({
        col1: "Sub - Total =",
        col2: subTotal?.existing,
        col3: subTotal?.promote,
        col4: subTotal?.recruit,
        col5: subTotal?.total,
      });
    };

    if (exec.length) {
      addRowData("Executives", exec, subTotalExecutive);
    }

    if (non.length) {
      addRowData("Non-Executives", non, subTotalNon);
    }

    const totalRow = grade?.total?.[0] || {};
    rows.push({
      col1: "Total =",
      col2: totalRow.existing || 0,
      col3: totalRow.promote || 0,
      col4: totalRow.recruit || 0,
      col5: totalRow.total || 0,
    });

    return rows;
  };

  const processOverall = (overall: any, type: string, label: string): any => {
    return {
      type,
      label,
      operatingUnit: overall.operating_unit,
      budgetYear: overall.budget_year,
      rows: formatGradeData(overall.grade),
      budgetRange: overall.budget_range,
      existingDate: overall.existing_date,
    };
  };

  const result: any[] = [];

  if (data.overall) {
    result.push(processOverall(data.overall, "overall", "Overall"));
  }

  if (data.organization_overall) {
    data.organization_overall.forEach((org: any, index: number) => {
      result.push(
        processOverall(org.overall, "organization", `Organization ${index + 1}`)
      );
      org.location_overall.forEach((loc: any, locIndex: number) => {
        result.push(
          processOverall(
            loc,
            "location",
            `Location ${index + 1}.${locIndex + 1}`
          )
        );
      });
    });
  }

  return result;
};

const MyDocument: FC<any> = ({ data, onRender }) => {
  const page = convertRawData(data);
  return (
    <Document
      onRender={(e: any) => {
        if (typeof onRender === "function") {
          onRender();
        }
      }}
    >
      {page.map((page, pageIndex) => {
        return (
          <Page size="A4" style={styles.page} key={"page_" + pageIndex}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                style={{ ...styles.image, marginRight: 10, marginLeft: 10 }}
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/julong.png`}
              />
              <View style={styles.section}>
                <Text style={styles.title}>JULONG GROUP (INDONESIA)</Text>
                <Text
                  style={{ textAlign: "center", fontFamily: "Noto Sans SC" }}
                >
                  聚龙集团印尼区
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                padding: 10,
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    border: 1,
                    borderColor: "black",
                  }}
                >
                  <View>
                    <View style={styles.section}>
                      <Text
                        style={{
                          ...styles.title,
                          textDecoration: "underline",
                          marginBottom: 10,
                        }}
                      >
                        STAFF REQUIREMENT
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginBottom: 10, padding: 5 }}>
                    <View
                      style={{
                        ...styles.section,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          width: 100,
                        }}
                      >
                        OPERATING UNIT
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          paddingLeft: 10,
                          paddingRight: 10,
                        }}
                      >
                        :
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          paddingVertical: 1,
                        }}
                      >
                        {page?.operatingUnit}
                      </Text>
                    </View>

                    <View
                      style={{
                        ...styles.section,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          width: 100,
                        }}
                      >
                        BUDGET YEAR
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          paddingLeft: 10,
                          paddingRight: 10,
                        }}
                      >
                        :
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          paddingVertical: 1,
                        }}
                      >
                        {page?.budgetYear}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      borderBottom: 1,
                      borderTop: 1,
                      borderColor: "black",
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 5,
                        borderRight: 1,
                        flexGrow: 1,
                        borderColor: "black",
                      }}
                    >
                      <Text style={styles.thead}>Grade</Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRight: 1,
                        borderColor: "black",
                        width: 100,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: 5,
                        }}
                      >
                        <Text style={styles.thead}>Existing</Text>
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          flexGrow: 1,
                          width: "100%",
                          borderTop: 1,
                          borderColor: "black",
                        }}
                      >
                        <Text style={styles.thead}>{page?.existingDate}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRight: 1,
                        borderColor: "black",
                        width: 200,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: 5,
                        }}
                      >
                        <Text style={styles.thead}>{page?.budgetRange}</Text>
                      </View>

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          width: 200,
                          borderTop: 1,
                          borderColor: "black",
                        }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: 5,
                            borderRight: 1,
                            width: 100,
                            borderColor: "black",
                          }}
                        >
                          <Text style={styles.thead}>Promote</Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: 100,
                            borderColor: "black",
                          }}
                        >
                          <Text style={styles.thead}>Recruit</Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderColor: "black",
                        width: 100,
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: 5,
                        }}
                      >
                        <Text style={styles.thead}>TOTAL</Text>
                      </View>

                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.thead}>{page?.budgetYear}</Text>
                      </View>
                    </View>
                  </View>
                  {/* ROW */}
                  <Row col1=" " />
                  {page.rows.map((row: any, rowIndex: any) => (
                    <Row
                      key={"page_" + pageIndex + "_row_" + rowIndex}
                      styleText={{
                        fontFamily: [
                          "Executives",
                          "Non - Executives",
                          "Sub - Total =",
                          "Total =",
                        ].includes(row?.col1)
                          ? "roboto"
                          : "roboto-light",
                        fontWeight: [
                          "Executives",
                          "Non - Executives",
                          "Sub - Total =",
                          "Total =",
                        ].includes(row?.col1)
                          ? "bold"
                          : "light",
                        textDecoration: [
                          "Executives",
                          "Non - Executives",
                        ].includes(row?.col1)
                          ? "underline"
                          : "none",
                      }}
                      col1={row.col1}
                      col2={row.col2}
                      col3={row.col3}
                      col4={row.col4}
                      col5={row.col5}
                      footer={
                        row?.col1 === "Sub - Total =" || row?.col1 === "Total ="
                          ? true
                          : false
                      }
                      hideBorder={row?.col1 === "Total =" ? true : false}
                    />
                  ))}
                </View>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default MyDocument;
