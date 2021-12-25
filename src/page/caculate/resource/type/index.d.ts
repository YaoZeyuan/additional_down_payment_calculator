export type Type_Config = {
    pay_method_还款方式: 1 | 2
    income_月收入_万元: number
    cash_当前存款_万元: number
    extend_pay_count_预计补交的首付金额_万元: number
    rate_预期每年投资收益率_数字_百分数: number
    rate_商贷利率_数字_百分数: number
    year_商贷贷款年份: number
    loan_商贷贷款金额_万元: number
    rate_公积金利率_数字_百分数: number
    year_公积金贷款年份: number
    loan_公积金贷款金额_万元: number
}

export type Type_按月数据 = {
    month_总月份: number,
    year_总年份: number,
    month_月份: string,
    interest_每月利息: number,
    loan_每月本金: number,
    loan_剩余还款额: number
    cash_当月收入: number
    cash_当年剩余待投资理财现金: number
    cash_当年理财中资产: number
}

export type Type_Summary = {
    yuegong_每月月供额: number,
    rate_总利息: number,
    totalPrice_还款总额: number,
    loan_总贷款额: number,
    year_年份: number,
    cash_最终持有现金资产数_元: number
    loan_最终实际发生_商贷贷款金额_元: number,
    loan_最终实际发生_公积金贷款金额_元: number,
}
