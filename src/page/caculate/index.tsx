import CaculateInst from "./cacl_计算器";
import * as Types from "./resource/type/index";
import * as Consts from "./resource/const/index";
import {
  Button,
  Table,
  Form,
  Input,
  InputNumber,
  Radio,
  Card,
  Col,
  Row,
  Divider,
} from "antd";
import { useState } from "react";
import ShowCash from "./component/show_cash";
import Storage from "~/src/library/storage/index";

import "./index.less";

export default () => {
  let defaultConfig = Storage.get<Types.Type_Config>(
    Consts.Const_Storage_Key,
    Consts.Const_Default_Config
  );

  let [recordList, setRecordList] = useState<Types.Type_按月数据[]>([]);
  let [summary, setSummary] = useState<Types.Type_Summary>({
    ...Consts.Const_Default_Summary,
  });

  let [form] = Form.useForm<Types.Type_Config>();

  let startCaculate = () => {
    let config = form.getFieldsValue();

    Storage.set(Consts.Const_Storage_Key, {
      ...config,
    });

    let cash_提前还款金额_元 =
      config.extend_pay_count_预计补交的首付金额_万元 * Consts.Const_万元;
    let loan_最终实际发生_商贷贷款金额_元 =
      config.loan_商贷贷款金额_万元 * Consts.Const_万元;
    let loan_最终实际发生_公积金贷款金额_元 =
      config.loan_公积金贷款金额_万元 * Consts.Const_万元;
    if (cash_提前还款金额_元 > loan_最终实际发生_商贷贷款金额_元) {
      cash_提前还款金额_元 =
        cash_提前还款金额_元 - loan_最终实际发生_商贷贷款金额_元;
      loan_最终实际发生_商贷贷款金额_元 = 0;
    } else {
      loan_最终实际发生_商贷贷款金额_元 =
        loan_最终实际发生_商贷贷款金额_元 - cash_提前还款金额_元;
      cash_提前还款金额_元 = 0;
    }
    if (cash_提前还款金额_元 > 0) {
      loan_最终实际发生_公积金贷款金额_元 =
        loan_最终实际发生_公积金贷款金额_元 - cash_提前还款金额_元;
      cash_提前还款金额_元 = 0;
    }

    let loanResult = CaculateInst.cacl_组合贷({
      type: config.pay_method_还款方式,
      loan_商贷贷款金额: loan_最终实际发生_商贷贷款金额_元,
      loan_公积金贷款金额: loan_最终实际发生_公积金贷款金额_元,
      year_商贷贷款年限: config.year_商贷贷款年份,
      year_公积金贷款年限: config.year_公积金贷款年份,
      rate_商贷利率: config.rate_商贷利率_数字_百分数 * Consts.Const_百分比,
      rate_公积金利率: config.rate_公积金利率_数字_百分数 * Consts.Const_百分比,
    });

    let raw_month_按月结果 = loanResult.monthdataList_分月还款数据;
    let month_按月计算: Types.Type_按月数据[] = [];

    let cash_当前已投入理财金额_元 =
      (config.cash_当前存款_万元 -
        config.extend_pay_count_预计补交的首付金额_万元) *
      Consts.Const_万元;
    let cash_当年剩余资金 = 0;
    let cash_每月收入_元 = config.income_月收入_万元 * Consts.Const_万元;
    let rate_年化理财收益率 =
      config.rate_预期每年投资收益率_数字_百分数 * Consts.Const_百分比;
    for (let item_贷款还款数据 of raw_month_按月结果) {
      // 第一个月没有理财收益
      if (
        item_贷款还款数据.month_总月份 % 12 === 1 &&
        item_贷款还款数据.month_总月份 !== 1
      ) {
        // 一年的开始
        // 理财本金变为: 理财本金 * (1 + 理财收益%)
        // 将去年所有剩余资金加入已投资理财金额

        cash_当前已投入理财金额_元 =
          cash_当前已投入理财金额_元 * (1 + rate_年化理财收益率);
        cash_当前已投入理财金额_元 =
          cash_当前已投入理财金额_元 + cash_当年剩余资金;
        cash_当年剩余资金 = 0;

        cash_当年剩余资金 =
          cash_当年剩余资金 +
          cash_每月收入_元 -
          item_贷款还款数据.loan_每月本金 -
          item_贷款还款数据.interest_每月利息;

        let item_当月数据: Types.Type_按月数据 = {
          ...item_贷款还款数据,
          cash_当年剩余待投资理财现金: cash_当年剩余资金,
          cash_当年理财中资产: cash_当前已投入理财金额_元,
          cash_当月收入: cash_每月收入_元,
        };
        month_按月计算.push({
          ...item_当月数据,
        });
      } else {
        cash_当年剩余资金 =
          cash_当年剩余资金 +
          cash_每月收入_元 -
          item_贷款还款数据.loan_每月本金 -
          item_贷款还款数据.interest_每月利息;

        let item_当月数据: Types.Type_按月数据 = {
          ...item_贷款还款数据,
          cash_当年剩余待投资理财现金: cash_当年剩余资金,
          cash_当年理财中资产: cash_当前已投入理财金额_元,
          cash_当月收入: cash_每月收入_元,
        };
        month_按月计算.push({
          ...item_当月数据,
        });
      }
    }

    let lastCycleItem = month_按月计算[month_按月计算.length - 1];

    let sumamry: Types.Type_Summary = {
      yuegong_每月月供额: loanResult.yuegong_每月月供额,
      rate_总利息: loanResult.rate_总利息,
      totalPrice_还款总额: loanResult.totalPrice_还款总额,
      loan_总贷款额: loanResult.loan_总贷款额,
      year_年份: loanResult.year_年份,
      loan_最终实际发生_商贷贷款金额_元,
      loan_最终实际发生_公积金贷款金额_元,
      cash_最终持有现金资产数_元:
        lastCycleItem.cash_当年理财中资产 +
        lastCycleItem.cash_当年剩余待投资理财现金,
    };

    setSummary(sumamry);
    setRecordList(month_按月计算);
    console.log("config => ", config);
  };

  let tableCellRender = (value: number) => {
    return <ShowCash cash={value}></ShowCash>;
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="配置" bordered={false}>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              form={form}
              initialValues={{
                ...defaultConfig,
              }}
            >
              <Form.Item name="pay_method_还款方式" label="还款方式">
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value={Consts.Const_Return_Type_等额本息}>
                    等额本息
                  </Radio.Button>
                  <Radio.Button value={Consts.Const_Return_Type_等额本金}>
                    等额本金
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="当前存款">
                <Form.Item noStyle name="cash_当前存款_万元">
                  <InputNumber></InputNumber>
                </Form.Item>
                万元
              </Form.Item>
              <Form.Item label="预计补交的首付金额">
                <Form.Item
                  rules={[
                    {
                      validator: async () => {
                        let config = form.getFieldsValue();
                        let checker_补交首付款不能高于总存款 =
                          config.cash_当前存款_万元 >=
                          config.extend_pay_count_预计补交的首付金额_万元;
                        let loan_总贷款数 =
                          config.loan_公积金贷款金额_万元 +
                          config.loan_商贷贷款金额_万元;
                        let checker_补交首付款不能高于总贷款 =
                          loan_总贷款数 >=
                          config.extend_pay_count_预计补交的首付金额_万元;
                        if (checker_补交首付款不能高于总存款 === false) {
                          return new Promise((reslove, reject) => {
                            reject(new Error("补交首付款不能高于总存款"));
                          });
                        }
                        if (checker_补交首付款不能高于总贷款 === false) {
                          return new Promise((reslove, reject) => {
                            reject(new Error("补交首付款不能高于总贷款"));
                          });
                        }
                        return true;
                      },
                    },
                  ]}
                  noStyle
                  name="extend_pay_count_预计补交的首付金额_万元"
                >
                  <InputNumber></InputNumber>
                </Form.Item>
                万元
              </Form.Item>
              <Form.Item label="月收入">
                <Form.Item noStyle name="income_月收入_万元">
                  <InputNumber></InputNumber>
                </Form.Item>
                万元
              </Form.Item>
              <Form.Item label="公积金贷款金额">
                <Form.Item noStyle name="loan_公积金贷款金额_万元">
                  <InputNumber></InputNumber>
                </Form.Item>
                万元
              </Form.Item>
              <Form.Item label="商贷贷款金额">
                <Form.Item noStyle name="loan_商贷贷款金额_万元">
                  <InputNumber></InputNumber>
                </Form.Item>
                万元
              </Form.Item>
              <Form.Item label="公积金利率">
                <Form.Item noStyle name="rate_公积金利率_数字_百分数">
                  <InputNumber></InputNumber>
                </Form.Item>
                %
              </Form.Item>
              <Form.Item label="商贷利率">
                <Form.Item noStyle name="rate_商贷利率_数字_百分数">
                  <InputNumber></InputNumber>
                </Form.Item>
                %
              </Form.Item>
              <Form.Item label="预期每年投资收益率">
                <Form.Item noStyle name="rate_预期每年投资收益率_数字_百分数">
                  <InputNumber></InputNumber>
                </Form.Item>
                %
              </Form.Item>
              <Form.Item label="公积金贷款年份">
                <Form.Item noStyle name="year_公积金贷款年份">
                  <InputNumber></InputNumber>
                </Form.Item>
                年
              </Form.Item>
              <Form.Item label="商贷贷款年份">
                <Form.Item noStyle name="year_商贷贷款年份">
                  <InputNumber></InputNumber>
                </Form.Item>
                年
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" onClick={startCaculate}>
                  开始计算
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="汇总结果" bordered={false}>
            <pre className="pre-result">{JSON.stringify(summary, null, 2)}</pre>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="计算规则" bordered={false}>
            <pre className="pre-result">
              {`计算方案解释:

假设交完首付后, 我们剩余 a 万元现金, 背负 b 万元存款, 还款 c 年, 利率 d, 期间每月收入 e 万元, 买房剩余现金+缴纳月供后剩余现金每年年底全部拿去买理财, 理财年收益 f,

需要考虑的问题为: 是否要补交首付, 以求完成所有还款后, 剩余总资金最多.

这里列数学公式并不直观, 贷款年份对最终结果也有明显影响(理财收益是复利模式, 年限越长影响越大), 所以我们选择暴力计算每一种参数对应的实际还款过程&最终结果, 方便观察结论

为计算方便, 在接下来的计算中, 我们假定

- 实际贷款发生额 = 总贷款数 - 预计补交首付数
  - 预计补交首付数小于当前存款数, 小于总贷款数
  - 补交的首付优先补交商贷(利率高), 然后再补交公积金
  - 不补交首付的现金存款用于购买当年的理财
- 贷款每月泵缴
  - **每月收入必须大于贷款首月还款额**
  - 每月收入减去还款额后, 剩余资金并不购买理财, 而是到年底统一购买理财, 方便计算总金额
- 理财每年结算一次
  - 只买一年期的理财
  - 当年年底剩余现金全额计入下一年的理财起始资金中(复利模式)
- 不考虑通货膨胀
  - 通货膨胀后只影响货币"值钱度", 但不影响待还款金额, 因此可以忽略该因素
- 理财收益率/贷款利率/月收入固定, 不会提前还款
  - 方便计算

**注意:**

该模型为理论运算结果, 仅供参考, 不构成任何房贷方案设计推荐

在实际应用中, 除了最终收益率, 至少还需要考虑以下因素

1.  **投资收益率并不稳定**, 个别年份可能为负(炒股), 甚至全亏(中行原油宝, 亏成负数)
2.  长时间范围内家庭对大额现金的需求几乎是确定时间(结婚/生子/疾病/教育/...)
3.  长时间范围内收入变动几乎是确定时间(行业整治:互联网金融/在线培训/年满 35/...)`}
            </pre>
          </Card>
        </Col>
      </Row>
      <Divider></Divider>
      <Table
        dataSource={recordList}
        rowKey={"month_总月份"}
        columns={[
          {
            title: "总月份",
            dataIndex: "month_总月份",
          },
          {
            title: "年份",
            dataIndex: "year_总年份",
          },
          {
            title: "月份",
            dataIndex: "month_月份",
          },
          {
            title: "当前积累总资产",
            dataIndex: "",
            render: (_, item) => {
              return (
                <ShowCash
                  cash={
                    item.cash_当年剩余待投资理财现金 + item.cash_当年理财中资产
                  }
                ></ShowCash>
              );
            },
          },
          {
            title: "当年剩余待投资理财现金",
            dataIndex: "cash_当年剩余待投资理财现金",
            render: tableCellRender,
          },
          {
            title: "当年理财中资产",
            dataIndex: "cash_当年理财中资产",
            render: tableCellRender,
          },
          {
            title: "每月还款额",
            dataIndex: "",
            render: (_, item) => {
              return (
                <ShowCash
                  cash={item.interest_每月利息 + item.loan_每月本金}
                ></ShowCash>
              );
            },
          },
          {
            title: "每月利息",
            dataIndex: "interest_每月利息",
            render: tableCellRender,
          },
          {
            title: "每月本金",
            dataIndex: "loan_每月本金",
            render: tableCellRender,
          },
          {
            title: "剩余还款额",
            dataIndex: "loan_剩余还款额",
            render: tableCellRender,
          },
        ]}
        pagination={{
          pageSize: 12,
        }}
      ></Table>
    </div>
  );
};
