import * as Types from '../type/index'

export const Const_万元 = 10000
export const Const_百分比 = 1 / 100

export const Const_Return_Type_等额本息 = 1
export const Const_Return_Type_等额本金 = 2
export const Const_Storage_Key = "loan_caculator_via_yaozeyuan"



export const Const_Default_Config: Types.Type_Config = {
    pay_method_还款方式: Const_Return_Type_等额本息,
    cash_当前存款_万元: 10,
    extend_pay_count_预计补交的首付金额_万元: 5,
    income_月收入_万元: 3,
    loan_公积金贷款金额_万元: 50,
    loan_商贷贷款金额_万元: 150,
    rate_公积金利率_数字_百分数: 3.25,
    rate_商贷利率_数字_百分数: 5.2,
    rate_预期每年投资收益率_数字_百分数: 3,
    year_公积金贷款年份: 25,
    year_商贷贷款年份: 25,
};

export const Const_Default_Summary: Types.Type_Summary = {
    yuegong_每月月供额: 0,
    rate_总利息: 0,
    totalPrice_还款总额: 0,
    loan_总贷款额: 0,
    year_年份: 0,
    cash_最终持有现金资产数_元: 0,
    loan_最终实际发生_商贷贷款金额_元: 0,
    loan_最终实际发生_公积金贷款金额_元: 0,
}

export const Const_Default_月度数据: Types.Type_按月数据 = {
    month_总月份: 0,
    year_总年份: 0,
    month_月份: "",
    interest_每月利息: 0,
    loan_每月本金: 0,
    loan_剩余还款额: 0,
    cash_当年剩余待投资理财现金: 0,
    cash_当年理财中资产: 0,
    cash_当月收入: 0,
}