import { useEffect, useState } from "react"
import "./transition_module.css"
import image from "./animation/76888-color-data-analysis.gif"
import {
    ComposedChart,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import MaterialTable from "material-table";

function Transition(props) {
    const { name, info, wifeInfo, saving, huyoList, payList, incomeList, dicisionInfo, loading, quitLoad } = props //<=これが推移に必要な道具
    //順番に その人の情報、配偶者情報、現在の貯蓄、扶養リスト、支出リスト、その他収入リスト、万能関数
    //万能関数の引数に適切な値を突っ込めばその年の手取りが出るようになってる

    useEffect(() => {
        setTimeout(() => {
            quitLoad()
        }, 4000)
    }, [])

    /* ？歳までを選択した際の期限が切れてるかを確かめて0か1を返す関数 */
    function isExpired(type2, count, age) {
        if (type2 === "every") {
            return 1;
        }
        else if (type2 === "before") {
            if (age <= count) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else if (type2 === "after") {
            if (age >= count) {
                return 1;
            }
            else {
                return 0;
            }
        }
        else {
            if (age === count) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }

    var savingArray_ = []

    var data = []  // year age wage self wife income outcome exoenses stock
    var cdata = []

    const [dataState, setDataState] = useState([]);
    const [minusType, setMinusType] = useState();
    const [realState, setRealState] = useState();
    const [lastSaving, setLastSaving] = useState();
    const [chartData, setChartData] = useState();
    const [minusY, setMinusY] = useState();

    var minusYear;

    /* 配列の中身を合計する（？歳までを選択した場合はそこからは足さない） */
    const sumArray = (array, age) => {
        let sum = 0;
        for (let i = 0, len = array.length; i < len; i++) {
            sum += (Number)(array[i].charge) *
                isExpired(array[i].type2, (Number)(array[i].count), age);
        }
        return sum;
    };

    useEffect(() => {

        /**初期値を計算 */
        let i = 0
        let outCome = sumArray(payList, (Number)(info.age))
        let inCome =
            Number(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1,  info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori) +
            Number(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1,  wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori) +
            sumArray(incomeList, (Number)(info.age))
        let Result = inCome - outCome

        //仮貯蓄
        savingArray_[0] = Number(saving) + Result

        // 貯蓄を仮計算
        for (let i = 1; i < 96 - info.age; i++) {

            outCome = sumArray(payList, (Number)(info.age) + i)

            inCome =
                Number(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1, info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori) +
                Number(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1, wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori) +
                sumArray(incomeList, (Number)(info.age) + i)

            Result = inCome - outCome
            // 仮貯蓄
            savingArray_.push(Result + Number(savingArray_[i - 1]));
        }

        for (let i = 0; i < savingArray_.length; i++) {
            if (Number(savingArray_[i]) < 0 && !minusYear) {
                minusYear = Number(info.age) + i;
                console.log(minusYear);
            }
        }

        var realIncome;

        /**もし95歳の時の貯蓄が負の場合 */
        //console.log(savingArray_);
        if (savingArray_[savingArray_.length - 1] < 0) {
            if (minusYear > 65) {
                /**不動産所得（95歳の貯蓄 ÷ 95歳までの年数） */
                realIncome = - (Number(savingArray_[savingArray_.length - 1]) / Number(95 - (minusYear - 1) - 1));
                setMinusType(0);
            }
            else {
                realIncome = - (Number(savingArray_[savingArray_.length - 1]) / Number(95 - 65) - 1);
                minusYear = 65;
                setMinusType(1)
            }
        }
        else {
            realIncome = 8 * 12;
            minusYear = 65;
            setMinusType(2);
        }


        i = 0

        outCome = sumArray(payList, (Number)(info.age) + i)
        inCome =
            Number(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1, info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori) +
            Number(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1, wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori) +
            sumArray(incomeList, (Number)(info.age) + i)
        Result = inCome - outCome;

        data.push({
            year: i + "年",
            age: Number(info.age) + i + "歳",
            wage: Number(wifeInfo.age) + i + "歳",
            self: Math.floor(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1, info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori),
            wife: Math.floor(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1, wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori),
            income: Math.floor(inCome),
            outcome: Math.floor(outCome),
            expenses: Math.floor(Result),
            realincome: 0,
            saving: Math.floor(Number(saving) + Result)
        })

        for (let i = 1; i < savingArray_.length; i++) {
            outCome = sumArray(payList, (Number)(info.age) + i)
            inCome =
                Number(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1, info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori) +
                Number(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1, wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori) +
                sumArray(incomeList, (Number)(info.age) + i)

            if (i + Number(info.age) < minusYear) {
                Result = inCome - outCome;
                data.push({
                    year: i + "年",
                    age: Number(info.age) + i + "歳",
                    wage: Number(wifeInfo.age) + i + "歳",
                    self: Math.floor(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1, info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori),
                    wife: Math.floor(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1, wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori),
                    income: Math.floor(inCome),
                    outcome: Math.floor(outCome),
                    expenses: Math.floor(Result),
                    realincome: 0,
                    saving: Math.floor(Result + Number(data[i - 1].saving))
                });
            }
            else {
                Result = inCome + realIncome - outCome;
                data.push({
                    year: i + "年",
                    age: Number(info.age) + i + "歳",
                    wage: Number(wifeInfo.age) + i + "歳",
                    self: Math.floor(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1, info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori),
                    wife: Math.floor(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1, wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori),
                    income: Math.floor(inCome),
                    outcome: Math.floor(outCome),
                    expenses: Math.floor(Result),
                    realincome: Math.floor(realIncome),
                    saving: Math.floor(Result + Number(data[i - 1].saving))
                })
            }


        }

        for (let i = 0; i < data.length; i++) {
            cdata.push({
                年齢: data[i].age,
                貯蓄: data[i].saving,
                収入: data[i].income,
                不動産所得: data[i].realincome
            })
        }

        setDataState(data);
        setChartData(cdata);
        setRealState(Math.floor(realIncome / 12));
        setLastSaving(Math.floor(Number(data[data.length - 1].saving)));
        setMinusY(minusYear);
    }, [])


    return (
        <>
            {loading ?
                <div className="loading">
                    <img alt="" src={image} />
                    <p>推移を計算しています...</p>
                </div>
                :
                <div className="tr-contents">
                    <div style={{ width: '100%' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart
                                data={chartData}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="年齢" />
                                <YAxis />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="貯蓄" fill="#FFA500" />
                                <Area type="monotone" dataKey="収入" stackId="1" fill="#82ca9d" stroke="#82ca9d" />
                                <Area type="monotone" dataKey="不動産所得" stackId="1" fill="#8884d8" stroke="#8884d8" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="tr-txt">
                        {
                            (() => {
                                switch (minusType) {
                                    case 0:
                                        return (
                                            <>
                                                貯蓄がマイナスになる{minusY}歳から毎月{realState}万円の家賃収入を得られた場合、
                                                貯蓄がマイナスにならず、95歳の時の貯蓄を{lastSaving}万円にする事ができます。
                                            </>
                                        )
                                    case 1:
                                        return (
                                            <>
                                                {minusY}歳から毎月{realState}万円の家賃収入を得られた場合、
                                                貯蓄がマイナスにならず、95歳の時の貯蓄を{lastSaving}万円にする事ができます。
                                            </>
                                        )
                                    case 2:
                                        return (
                                            <>
                                                {minusY}歳から毎月{realState}万円の家賃収入を足すことで
                                                <br />
                                                95歳の時の貯蓄を{lastSaving}万円にすることができます。
                                            </>
                                        )
                                    default:
                                        break;
                                }
                            })()
                        }
                    </div>
                    <MaterialTable
                        title="資産推移"
                        columns={[
                            { title: '年度', field: 'year' },
                            { title: `${name} 様 年齢`, field: 'age' },
                            { title: '配偶者様 年齢', field: 'wage' },
                            { title: `${name} 様収入`, field: 'self' },
                            { title: '配偶者様収入', field: 'wife' },
                            { title: '収入合計', field: 'income' },
                            { title: '支出合計', field: 'outcome' },
                            { title: '収支', field: 'expenses' },
                            { title: '不動産所得', field: 'realincome' },
                            { title: '累計貯蓄額', field: 'saving' },
                        ]
                        }

                        data={dataState}
                        options={{
                            grouping: false,
                            search: false,
                            padding: "dense",
                            paging: false,
                            draggable: false,
                            sorting: false
                        }}
                    />
                </div>
            }
        </>
    )
}

export default Transition