# 首付多交计算器

通过实际计算, 帮助决策是否需要多交首付, 需要多交多少首付

| 变量列表           | 说明                                                                                                         |
| :----------------- | :----------------------------------------------------------------------------------------------------------- |
| 月收入             | 每月现金收入, 单位:元                                                                                        |
| 预计补交的首付金额 | 单位:元, 首付=基础首付+额外补交的首付, 基础首付是必填项, 不需要考虑.只有额外补交的首付需要考虑补交多少更合适 |
| 预期每年投资收益率 | 百分数, 5.2%则填 5.2                                                                                         |
| 商贷利率           | 百分数, 5.2%则填 5.2                                                                                         |
| 商贷贷款年份       | 单位:年                                                                                                      |
| 商贷贷款金额       | 单位:元                                                                                                      |
| 公积金贷款利率     | 百分数, 3.5%则填 3.5                                                                                         |
| 公积金贷款年份     | 单位:年                                                                                                      |
| 公积金贷款金额     | 单位:元                                                                                                      |

计算方案解释:

假设交完首付后, 我们剩余 a 万元现金, 背负 b 万元存款, 还款 c 年, 利率 d, 期间每月收入 e 万元, 买房剩余现金+缴纳月供后剩余现金每年年底全部拿去买理财, 理财年收益 f,

需要考虑的问题为: 是否要补交首付, 以求完成所有还款后, 剩余总资金最多.

这里列数学公式并不直观, 所以我们选择暴力计算每一种参数对应的实际还款过程&最终结果, 方便观察结论

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
3.  长时间范围内收入变动几乎是确定时间(行业整治:互联网金融/在线培训/年满 35/...)