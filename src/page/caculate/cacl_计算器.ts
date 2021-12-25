const Const_Return_Type_等额本息 = 1
const Const_Return_Type_等额本金 = 2

type Type_还款类型 = typeof Const_Return_Type_等额本息 | typeof Const_Return_Type_等额本金

type Type_计算结果 = {
    yuegong_每月月供额: number,
    rate_总利息: number,
    totalPrice_还款总额: number,
    monthdataList_分月还款数据: Type_分月还款详情[],
    loan_总贷款额: number,
    year_年份: number
    /**
     * 月供递减
     */
    interest_每月月供递减额?: number,
}

type Type_分月还款详情 = {
    month_总月份: number,
    year_总年份: number,
    month_月份: string,
    interest_每月利息: number,
    loan_每月本金: number,
    loan_剩余还款额: number
}

class Calcute {
    //商贷-公积金贷款统一函数
    singleDk(type: Type_还款类型, num: number, year: number, lilv: number) {
        // type:1等额本息 2等额本金，num 贷款金额 year贷款年限，lilv：贷款基准利率
        if (type === Const_Return_Type_等额本息) {
            return this.cacl_等额本息(num, year, lilv)
        } else if (type === Const_Return_Type_等额本金) {
            return this.cacl_等额本金(num, year, lilv)
        }
    }




    //组合贷款计算
    cacl_组合贷(
        {
            type,
            loan_商贷贷款金额,
            loan_公积金贷款金额,
            year_商贷贷款年限,
            year_公积金贷款年限,
            rate_商贷利率,
            rate_公积金利率
        }: {
            type: Type_还款类型,
            loan_商贷贷款金额: number,
            loan_公积金贷款金额: number,
            year_商贷贷款年限: number,
            year_公积金贷款年限: number,
            rate_商贷利率: number,
            rate_公积金利率: number
        }

    ): Type_计算结果 {
        let year = year_商贷贷款年限 > year_公积金贷款年限 ? year_商贷贷款年限 : year_公积金贷款年限;
        let mergemonthdataArray: Type_分月还款详情[]
        if (type === Const_Return_Type_等额本息) {
            let sdObj = this.cacl_等额本息(loan_商贷贷款金额, year_商贷贷款年限, rate_商贷利率);
            let gjjObj = this.cacl_等额本息(loan_公积金贷款金额, year_公积金贷款年限, rate_公积金利率);
            if (sdObj.monthdataList_分月还款数据.length > gjjObj.monthdataList_分月还款数据.length) {
                mergemonthdataArray = sdObj.monthdataList_分月还款数据.map(function (item, index) {
                    if (index < gjjObj.monthdataList_分月还款数据.length) {
                        return {
                            month_总月份: item.month_总月份,
                            year_总年份: item.year_总年份,
                            month_月份: item.month_月份,
                            interest_每月利息: item.interest_每月利息 + gjjObj.monthdataList_分月还款数据[index].interest_每月利息,
                            loan_每月本金: item.loan_每月本金 + gjjObj.monthdataList_分月还款数据[index].loan_每月本金,
                            loan_剩余还款额: item.loan_剩余还款额 + gjjObj.monthdataList_分月还款数据[index].loan_剩余还款额
                        } as Type_分月还款详情
                    } else {
                        return {
                            month_总月份: item.month_总月份,
                            year_总年份: item.year_总年份,
                            month_月份: item.month_月份,
                            interest_每月利息: item.interest_每月利息,
                            loan_每月本金: item.loan_每月本金,
                            loan_剩余还款额: item.loan_剩余还款额
                        } as Type_分月还款详情
                    }
                })
            } else {
                mergemonthdataArray = gjjObj.monthdataList_分月还款数据.map(function (item, index) {
                    if (index < sdObj.monthdataList_分月还款数据.length) {
                        return {
                            month_总月份: item.month_总月份,
                            year_总年份: item.year_总年份,
                            month_月份: item.month_月份,
                            interest_每月利息: item.interest_每月利息 + sdObj.monthdataList_分月还款数据[index].interest_每月利息,
                            loan_每月本金: item.loan_每月本金 + sdObj.monthdataList_分月还款数据[index].loan_每月本金,
                            loan_剩余还款额: item.loan_剩余还款额 + sdObj.monthdataList_分月还款数据[index].loan_剩余还款额
                        } as Type_分月还款详情
                    } else {
                        return {
                            month_总月份: item.month_总月份,
                            year_总年份: item.year_总年份,
                            month_月份: item.month_月份,
                            interest_每月利息: item.interest_每月利息,
                            loan_每月本金: item.loan_每月本金,
                            loan_剩余还款额: item.loan_剩余还款额
                        } as Type_分月还款详情
                    }
                })
            }
            return {
                yuegong_每月月供额: sdObj.yuegong_每月月供额 + gjjObj.yuegong_每月月供额,
                rate_总利息: sdObj.rate_总利息 + gjjObj.rate_总利息,
                totalPrice_还款总额: sdObj.totalPrice_还款总额 + gjjObj.totalPrice_还款总额,
                monthdataList_分月还款数据: mergemonthdataArray,
                loan_总贷款额: sdObj.loan_总贷款额 + gjjObj.loan_总贷款额,
                year_年份: year
            } as Type_计算结果

        } else if (type === Const_Return_Type_等额本金) {
            let sdObj = this.cacl_等额本金(loan_商贷贷款金额, year_商贷贷款年限, rate_商贷利率);
            let gjjObj = this.cacl_等额本金(loan_公积金贷款金额, year_公积金贷款年限, rate_公积金利率);
            if (sdObj.monthdataList_分月还款数据.length > gjjObj.monthdataList_分月还款数据.length) {
                mergemonthdataArray = sdObj.monthdataList_分月还款数据.map(function (item, index) {
                    if (index < gjjObj.monthdataList_分月还款数据.length) {
                        return {
                            month_总月份: item.month_总月份,
                            year_总年份: item.year_总年份,
                            month_月份: item.month_月份,
                            interest_每月利息: item.interest_每月利息 + gjjObj.monthdataList_分月还款数据[index].interest_每月利息,
                            loan_每月本金: item.loan_每月本金 + gjjObj.monthdataList_分月还款数据[index].loan_每月本金,
                            loan_剩余还款额: item.loan_剩余还款额 + gjjObj.monthdataList_分月还款数据[index].loan_剩余还款额
                        } as Type_分月还款详情
                    } else {
                        return {
                            month_总月份: item.month_总月份,
                            year_总年份: item.year_总年份,
                            month_月份: item.month_月份,
                            interest_每月利息: item.interest_每月利息,
                            loan_每月本金: item.loan_每月本金,
                            loan_剩余还款额: item.loan_剩余还款额
                        } as Type_分月还款详情
                    }

                })
            } else {
                mergemonthdataArray = gjjObj.monthdataList_分月还款数据.map(function (item, index) {
                    if (index < sdObj.monthdataList_分月还款数据.length) {
                        return {
                            month_总月份: item.month_总月份,
                            year_总年份: item.year_总年份,
                            month_月份: item.month_月份,
                            interest_每月利息: item.interest_每月利息 + sdObj.monthdataList_分月还款数据[index].interest_每月利息,
                            loan_每月本金: item.loan_每月本金 + sdObj.monthdataList_分月还款数据[index].loan_每月本金,
                            loan_剩余还款额: item.loan_剩余还款额 + sdObj.monthdataList_分月还款数据[index].loan_剩余还款额
                        } as Type_分月还款详情
                    } else {
                        return {
                            month_总月份: item.month_总月份,
                            year_总年份: item.year_总年份,
                            month_月份: item.month_月份,
                            interest_每月利息: item.interest_每月利息,
                            loan_每月本金: item.loan_每月本金,
                            loan_剩余还款额: item.loan_剩余还款额
                        } as Type_分月还款详情
                    }
                })
            }
            return {
                yuegong_每月月供额: sdObj.yuegong_每月月供额 + gjjObj.yuegong_每月月供额,
                rate_总利息: sdObj.rate_总利息 + gjjObj.rate_总利息,
                totalPrice_还款总额: sdObj.totalPrice_还款总额 + gjjObj.totalPrice_还款总额,
                // @ts-ignore
                interest_每月月供递减额: (sdObj.interest_每月月供递减额 + gjjObj.interest_每月月供递减额) as number,
                loan_总贷款额: sdObj.loan_总贷款额 + gjjObj.loan_总贷款额,
                year_年份: year,
                monthdataList_分月还款数据: mergemonthdataArray
            } as Type_计算结果
        }
        // @ts-ignore
        return
    }
    //等额本息计算
    cacl_等额本息(loan_贷款金额: number, year_贷款年限: number, rate_贷款利率: number): Type_计算结果 {
        //每月月供额=〔贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
        let month = year_贷款年限 * 12
        let monthlilv = rate_贷款利率 / 12
        let dknum = loan_贷款金额
        //每月月供
        let yuegong = (dknum * monthlilv * Math.pow((1 + monthlilv), month)) / (Math.pow((1 + monthlilv), month) - 1);
        //总利息=还款月数×每月月供额-贷款本金
        let totalLixi = month * yuegong - dknum;
        //还款总额 总利息+贷款本金
        let totalPrice = totalLixi + dknum
        let leftFund = totalLixi + dknum;

        //循环月份
        let monthdataArray: Type_分月还款详情[] = []
        let nowmonth = 1// new Date().getMonth()

        for (let i = 1; i <= month; i++) {
            let yearAt = Math.floor((i - 1) / 12);
            // @alert 这里以总月份作为一年的起止点, 因此是-2, 而非-1
            let momthAt = (nowmonth + i - 2) % 12 + 1;

            //console.log(realmonth)
            //每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
            let yuelixi = dknum * monthlilv * (Math.pow((1 + monthlilv), month) - Math.pow((1 + monthlilv), i - 1)) / (Math.pow((1 + monthlilv), month) - 1);
            //每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
            let yuebenjin = dknum * monthlilv * Math.pow((1 + monthlilv), i - 1) / (Math.pow((1 + monthlilv), month) - 1);
            leftFund = leftFund - (yuelixi + yuebenjin);
            if (leftFund < 0) {
                leftFund = 0
            }
            monthdataArray[i - 1] = {
                month_总月份: nowmonth + i - 1,
                year_总年份: yearAt + 1,
                month_月份: `第${yearAt + 1}年-第${momthAt}个月`,
                interest_每月利息: yuelixi,
                loan_每月本金: yuebenjin,
                //剩余还款
                loan_剩余还款额: leftFund
            } as Type_分月还款详情
        }
        return {
            yuegong_每月月供额: yuegong,
            rate_总利息: totalLixi,
            totalPrice_还款总额: totalPrice,
            monthdataList_分月还款数据: monthdataArray,
            loan_总贷款额: loan_贷款金额,
            year_年份: year_贷款年限
        } as Type_计算结果
    }
    //等额本金计算
    cacl_等额本金(loan_贷款金额: number, year_贷款年限: number, rate_贷款利率: number): Type_计算结果 {
        let month = year_贷款年限 * 12
        let month_利率 = rate_贷款利率 / 12
        let loan_总贷款金额 = loan_贷款金额
        let yhbenjin = 0 //首月还款已还本金金额是0
        //每月应还本金=贷款本金÷还款月数
        let everymonthyh = loan_总贷款金额 / month
        //每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
        let yuegong = everymonthyh + (loan_总贷款金额 - yhbenjin) * month_利率;
        //每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
        let yuegongdijian = everymonthyh * month_利率;
        //总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
        let totalLixi = ((everymonthyh + loan_总贷款金额 * month_利率) + loan_总贷款金额 / month * (1 + month_利率)) / 2 * month - loan_总贷款金额;
        //还款总额 总利息+贷款本金
        let totalPrice = totalLixi + loan_总贷款金额,
            leftFund = totalLixi + loan_总贷款金额;

        //循环月份
        let monthdataArray: Type_分月还款详情[] = []
        let nowmonth = 1//new Date().getMonth()

        for (let i = 1; i <= month; i++) {
            let yearAt = Math.floor((i - 1) / 12);
            // @alert 这里以总月份作为一年的起止点, 因此是-2, 而非-1
            let momthAt = (nowmonth + i - 2) % 12 + 1;

            yhbenjin = everymonthyh * (i - 1);
            let yuebenjin = everymonthyh + (loan_总贷款金额 - yhbenjin) * month_利率;
            //每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
            let yuelixi = (loan_总贷款金额 - yhbenjin) * month_利率;
            leftFund = leftFund - yuebenjin;
            if (leftFund < 0) {
                leftFund = 0
            }
            monthdataArray[i - 1] = {
                month_总月份: nowmonth + i - 1,
                year_总年份: yearAt + 1,
                month_月份: `第${yearAt + 1}年-第${momthAt}个月`,
                interest_每月利息: yuelixi,
                //每月本金
                loan_每月本金: everymonthyh,
                //剩余还款
                loan_剩余还款额: leftFund
            } as Type_分月还款详情
        }
        return {
            yuegong_每月月供额: yuegong,
            rate_总利息: totalLixi,
            totalPrice_还款总额: totalPrice,
            interest_每月月供递减额: yuegongdijian,
            monthdataList_分月还款数据: monthdataArray,
            loan_总贷款额: loan_贷款金额,
            year_年份: year_贷款年限
        } as Type_计算结果

    }
}


export default new Calcute()