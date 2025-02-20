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
import get from "lodash.get";
import { dayDate } from "@/lib/utils/date";
import { getNumber } from "@/lib/utils/getNumber";
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
  chineseFont: {
    fontFamily: "Noto Sans SC",
  },
  page: {
    padding: 20,
    fontFamily: "roboto",
    fontSize: 10,
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 10,
    textAlign: "center",
    fontWeight: "bold",
    width: 80,
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
    height: 50, // Atur tinggi gambar
    marginBottom: 5,
    alignSelf: "center",
  },
});
const extractMajors = (data: Array<{ Major: { Major: string } }>): string => {
  if (!data?.length) return "";
  return data.map((entry) => get(entry, "Major.Major")).join(", ");
};
const splitText = (
  input: string
): { firstPart: string; secondPart: string } => {
  const match = input.match(/^(.+?)\s+([^\s]+)$/); // Match "text text"
  return {
    firstPart: match?.[1] || "",
    secondPart: match?.[2] || "",
  };
};

const handleInput = (input: string, mode: "cn" | "id" = "id"): string => {
  const result = splitText(input);
  if (mode === "cn") {
    // Return only the Chinese part
    return result.secondPart;
  } else if (mode === "id") {
    // Return only the non-Chinese part
    return result.firstPart;
  }
  return ""; // Return empty string if the condition doesn't match the mode
};
// Create Document Component
const DocumentMPR: FC<any> = ({ data, onRender }) => {
  return (
    <Document
      onRender={(e: any) => {
        if (typeof onRender === "function") {
          onRender();
        }
      }}
    >
      <Page size="A4" style={styles.page}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            border: 1,
            borderColor: "black",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 100,

                borderRight: 1,
                borderColor: "black",
              }}
            >
              <Image
                style={{ ...styles.image, marginRight: 10, marginLeft: 10 }}
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/julong.png`}
              />
              <View>
                <Text style={styles.title}>JULONG GROUP INDONESIA</Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: 100,
                flexGrow: 1,
                height: "100%",
                borderRight: 1,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text>FORMULIR</Text>
                <Text
                  style={{
                    ...styles.chineseFont,
                  }}
                >
                  {" "}
                  表单
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                height: "100%",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    width: 130,
                    height: 20,
                    borderColor: "black",
                    borderRight: 1,
                    borderBottom: 1,
                  }}
                >
                  <Text>Nomor Dokumen</Text>
                  <Text
                    style={{
                      ...styles.chineseFont,
                    }}
                  >
                    {" "}
                    文件编码
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    borderColor: "black",
                    borderBottom: 1,
                    width: 130,
                    height: 20,
                  }}
                >
                  <Text>{get(data, "document_number")}</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    width: 130,
                    height: 20,
                    borderColor: "black",
                    borderRight: 1,
                    borderBottom: 1,
                  }}
                >
                  <Text>Revisi</Text>
                  <Text
                    style={{
                      ...styles.chineseFont,
                    }}
                  >
                    修正
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    width: 130,
                    borderColor: "black",
                    borderBottom: 1,
                    height: 20,
                  }}
                >
                  <Text>1</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    width: 130,
                    height: 20,
                    borderColor: "black",
                    borderRight: 1,
                    borderBottom: 1,
                  }}
                >
                  <Text>Tanggal Berlaku</Text>
                  <Text
                    style={{
                      ...styles.chineseFont,
                    }}
                  >
                    {" "}
                    有效期
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    width: 130,
                    borderColor: "black",
                    borderBottom: 1,
                    height: 20,
                  }}
                >
                  <Text>{dayDate(get(data, "document_date"))}</Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    width: 130,
                    height: 20,
                    borderColor: "black",
                    borderRight: 1,
                  }}
                >
                  <Text>Halaman</Text>
                  <Text
                    style={{
                      ...styles.chineseFont,
                    }}
                  >
                    {" "}
                    页面
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 5,
                    width: 130,
                    height: 20,
                    borderColor: "black",
                  }}
                >
                  <Text>1 dari 1</Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderTop: 1,
              borderColor: "black",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Text>KEBUTUHAN TENAGA KERJA</Text>
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                {" "}
                员工需求
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text>DATA KEBUTUHAN</Text>
          <Text
            style={{
              ...styles.chineseFont,
            }}
          >
            {" "}
            需求信息：
          </Text>
        </View>
        {/* BODY */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
          }}
        >
          <View
            style={{
              width: 140,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text>Jumlah kebutuhan</Text>
            <Text
              style={{
                ...styles.chineseFont,
              }}
            >
              {" "}
              需求人数
            </Text>
          </View>

          <Text>
            : {getNumber(get(data, "male_needs"))} ( Pria{" "}
            <Text
              style={{
                ...styles.chineseFont,
                width: 100,
              }}
            >
              男{" "}
            </Text>{" "}
            ) dan{" "}
            <Text
              style={{
                ...styles.chineseFont,
                width: 100,
              }}
            >
              和
            </Text>
            /atau{" "}
            <Text
              style={{
                ...styles.chineseFont,
                width: 100,
              }}
            >
              或
            </Text>{" "}
            {getNumber(get(data, "female_needs"))} ( Wanita{" "}
            <Text
              style={{
                ...styles.chineseFont,
                width: 100,
              }}
            >
              女{" "}
            </Text>{" "}
            )
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
          }}
        >
          <View
            style={{
              width: 140,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text>Status </Text>
            <Text
              style={{
                ...styles.chineseFont,
              }}
            >
              身份
            </Text>
          </View>
          <Text>
            :{" "}
            {get(data, "is_replacement") === "penggantian"
              ? "Penambahan"
              : "Penggantian"}
            , karena {handleInput(get(data, "request_category.Name"), "id")}{" "}
          </Text>
          <Text
            style={{
              ...styles.chineseFont,
            }}
          >
            {get(data, "is_replacement") === "penggantian" ? "增加" : "代替"}，
            {handleInput(get(data, "request_category.Name"), "cn")}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
          }}
        >
          <View
            style={{
              width: 140,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text>Usia </Text>
            <Text
              style={{
                ...styles.chineseFont,
              }}
            >
              年龄
            </Text>
          </View>
          <Text>: Minimal </Text>
          <Text
            style={{
              ...styles.chineseFont,
            }}
          >
            最小
          </Text>
          <Text> {get(data, "minimum_age")} Tahun </Text>
          <Text
            style={{
              ...styles.chineseFont,
            }}
          >
            岁
          </Text>
          <Text> / Maksimal </Text>
          <Text
            style={{
              ...styles.chineseFont,
            }}
          >
            最大
          </Text>
          <Text> {get(data, "maximum_age")} Tahun </Text>
          <Text
            style={{
              ...styles.chineseFont,
            }}
          >
            岁
          </Text>
        </View>
        {/* Status Perkawinan */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Status perkawinan{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                婚姻状况
              </Text>
            </Text>
          </View>
          <Text>
            :{" "}
            {get(data, "marital_status") === "no rules"
              ? "Tidak ada masalah"
              : get(data, "marital_status") === "single"
              ? "Single"
              : get(data, "marital_status") === "married"
              ? "Maried"
              : "-"}{" "}
            <Text
              style={{
                ...styles.chineseFont,
              }}
            >
              {get(data, "marital_status") === "no rules"
                ? "没问题"
                : get(data, "marital_status") === "single"
                ? "未婚"
                : get(data, "marital_status") === "married"
                ? "已婚"
                : "-"}
            </Text>
          </Text>
        </View>

        {/* PT/Est/Dept */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              PT/Est./Dept.{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                区域/部门
              </Text>
            </Text>
          </View>
          <Text>: {get(data, "organization_name")}</Text>
        </View>

        {/* Jabatan */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Jabatan{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                职位
              </Text>
            </Text>
          </View>
          <Text>: {get(data, "job_name")}</Text>
        </View>

        {/* Golongan */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Golongan{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                等级
              </Text>
            </Text>
          </View>
          <Text>: {get(data, "job_level_name")}</Text>
        </View>

        {/* Harapan Tanggal Masuk Kerja */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Harapan tanggal masuk kerja{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                入职时间期望
              </Text>
            </Text>
          </View>
          <Text>: {dayDate(get(data, "expected_date"))}</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Text>
              SPESIFIKASI JABATAN{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                职位规格
              </Text>
            </Text>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Pendidikan minimal{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                最低学历
              </Text>
            </Text>
          </View>
          <Text>: {get(data, "minimum_education")}</Text>
        </View>
        {/* Jurusan */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Jurusan{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                专业
              </Text>
            </Text>
          </View>
          <Text>: {extractMajors(get(data, "request_majors"))}</Text>
        </View>

        {/* Pengalaman Kerja */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Pengalaman kerja{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                工作经验
              </Text>
            </Text>
          </View>
          <Text>: {get(data, "experiences")}</Text>
        </View>

        {/* Kualifikasi yang Dibutuhkan */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Kualifikasi yang dibutuhkan{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                任职条件
              </Text>
            </Text>
          </View>
          <Text>: {get(data, "required_qualification")}</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Kemampuan khusus{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                特殊技能
              </Text>
            </Text>
          </View>
          <Text>: </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "roboto-light",
              flexWrap: "wrap",
            }}
          >
            {/* Sertifikat */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontFamily: "roboto-light",
                flexWrap: "wrap",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: 80,
                }}
              >
                <Text>
                  - Sertifikat{" "}
                  <Text
                    style={{
                      ...styles.chineseFont,
                    }}
                  >
                    证书
                  </Text>
                </Text>
              </View>
              <Text>: {get(data, "certificate")}</Text>
            </View>

            {/* Komputer */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontFamily: "roboto-light",
                flexWrap: "wrap",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: 80,
                }}
              >
                <Text>
                  - Komputer{" "}
                  <Text
                    style={{
                      ...styles.chineseFont,
                    }}
                  >
                    电脑
                  </Text>
                </Text>
              </View>
              <Text>: {get(data, "computer_skill")}</Text>
            </View>

            {/* Bahasa */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontFamily: "roboto-light",
                flexWrap: "wrap",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: 80,
                }}
              >
                <Text>
                  - Bahasa{" "}
                  <Text
                    style={{
                      ...styles.chineseFont,
                    }}
                  >
                    语言
                  </Text>
                </Text>
              </View>
              <Text>: {get(data, "language_skill")}</Text>
            </View>

            {/* Lainnya */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontFamily: "roboto-light",
                flexWrap: "wrap",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: 80,
                }}
              >
                <Text>
                  - Lainnya{" "}
                  <Text
                    style={{
                      ...styles.chineseFont,
                    }}
                  >
                    其他
                  </Text>
                </Text>
              </View>
              <Text>: {get(data, "other_skill")}</Text>
            </View>
          </View>
        </View>

        {/* Uraian Pekerjaan */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Uraian pekerjaan / Job desc{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                岗位职责
              </Text>
            </Text>
          </View>
          <Text>: {get(data, "jobdesc")}</Text>
        </View>

        {/* Rentang Gaji/Bulan */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontFamily: "roboto-light",
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: 140,
              flexWrap: "wrap",
            }}
          >
            <Text>
              Rentang gaji/bulan{" "}
              <Text
                style={{
                  ...styles.chineseFont,
                }}
              >
                月薪范围
              </Text>
            </Text>
          </View>
          <Text>
            : {get(data, "salary_min")} - {get(data, "salary_max")}{" "}
          </Text>
        </View>

        {/* FOOTER */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            border: 1,
            borderColor: "black",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",

              borderRight: 1,
              borderColor: "black",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexGrow: 1,
                height: 50,
              }}
            ></View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: 60,
                }}
              >
                <Text>Nama</Text>
                <Text
                  style={{
                    ...styles.chineseFont,
                  }}
                >
                  {" "}
                  姓名
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: 80,
                }}
              >
                <Text>: {get(data, "requestor_name")} </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: 60,
                }}
              >
                <Text>Posisi</Text>
                <Text
                  style={{
                    ...styles.chineseFont,
                  }}
                >
                  {" "}
                  职位
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: 80,
                }}
              >
                <Text>: </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: 60,
                }}
              >
                <Text>Tanggal</Text>
                <Text
                  style={{
                    ...styles.chineseFont,
                  }}
                >
                  {" "}
                  日期
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: 80,
                }}
              >
                <Text>: </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderBottom: 1,
                borderRight: 1,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <Text>Disetujui oleh</Text>
                <Text
                  style={{
                    ...styles.chineseFont,
                  }}
                >
                  {" "}
                  已批准：
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRight: 1,
                  borderColor: "black",
                  flexGrow: 1,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: 1,
                    height: 50,
                  }}
                ></View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: 50,
                    }}
                  >
                    <Text>Nama</Text>
                    <Text
                      style={{
                        ...styles.chineseFont,
                      }}
                    >
                      {" "}
                      姓名
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: 50,
                    }}
                  >
                    <Text>: {get(data, "department_head_name")}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexGrow: 1,
                    }}
                  >
                    <Text>Manager/Dept.Head</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexGrow: 1,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.chineseFont,
                      }}
                    >
                      {" "}
                      经理/部门领导
                    </Text>
                  </View>
                </View>
              </View>
              {/* ROW */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRight: 1,
                  borderColor: "black",
                  flexGrow: 1,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: 1,
                    height: 50,
                  }}
                ></View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: 50,
                    }}
                  >
                    <Text>Nama</Text>
                    <Text
                      style={{
                        ...styles.chineseFont,
                      }}
                    >
                      {" "}
                      姓名
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: 50,
                    }}
                  >
                    <Text>: {get(data, "vp_gm_director_name")}</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexGrow: 1,
                    }}
                  >
                    <Text>VP/GM/Direktur</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexGrow: 1,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.chineseFont,
                      }}
                    >
                      {" "}
                      总经理/董事/总监
                    </Text>
                  </View>
                </View>
              </View>
              {/* ROW */}
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRight: 1,
                  borderColor: "black",
                  flexGrow: 1,
                  height: "100%",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: 1,
                    height: 50,
                  }}
                ></View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text>CEO</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexGrow: 1,
                      paddingHorizontal: 4,
                      fontSize: 8,
                    }}
                  >
                    <Text>*TTD CEO jika luar budget</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexGrow: 1,
                      fontSize: 8,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.chineseFont,
                      }}
                    >
                      {" "}
                      *预算外需求需要CEO批
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderBottom: 1,
                borderColor: "black",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flexGrow: 1,
                  paddingHorizontal: 4,
                }}
              >
                <Text>Diverifikasi oleh</Text>
                <Text
                  style={{
                    ...styles.chineseFont,
                  }}
                >
                  {" "}
                  已审核:
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexGrow: 1,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    flexGrow: 1,
                    height: 50,
                  }}
                ></View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: 50,
                    }}
                  >
                    <Text>Nama</Text>
                    <Text
                      style={{
                        ...styles.chineseFont,
                      }}
                    >
                      {" "}
                      姓名
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      width: 50,
                    }}
                  >
                    <Text>: {get(data, "hrd_ho_unit_name")}</Text>
                  </View>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexGrow: 1,
                    }}
                  >
                    <Text>HRD HO/Unit</Text>
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexGrow: 1,
                    }}
                  >
                    <Text
                      style={{
                        ...styles.chineseFont,
                      }}
                    >
                      {" "}
                      总部/区域人力
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DocumentMPR;
