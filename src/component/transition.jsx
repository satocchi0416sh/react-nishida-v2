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

    var minusFlag = false;

    var data = []
    var cdata = []

    var minus_data = [
        {
            name: 0,
            saving: 0
        }
    ];

    const [minusYear, setMinusYear] = useState()
    const [minusSum, setMinusSum] = useState()
    const [chartData, setChartData] = useState();

    // 表関係
    const [tData, setTData] = useState()


    var tableData = []      // year age wage self wife income outcome exoenses stock

    const [lastSaving, setLastSaving] = useState();
    const [minusAgeState, setMinusAgeState] = useState([]);

    const minusAge = [];


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

        setMinusAgeState([]);

        /**初期値を計算 */
        let i = 0
        let outCome = sumArray(payList, (Number)(info.age) + i)
        let inCome =
            Number(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1 ,info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori) +
            Number(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1,  wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori) +
            sumArray(incomeList, (Number)(info.age) + i)
        let Result = inCome - outCome

        data.push(
            {
                name: info.age + "歳",
                saving: Math.floor(Number(saving) + Result),
                income: Math.floor(inCome)
            })

        tableData.push(
            {
                year: i + "年",
                age: Number(info.age) + i + "歳",
                wage: Number(wifeInfo.age) + i + "歳",
                self: Math.floor(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1,  info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori),
                wife: Math.floor(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1,  wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori),
                income: Math.floor(inCome),
                outcome: Math.floor(outCome),
                expenses: Math.floor(Result),
                saving: Math.floor(data[i].saving)
            }
        )
        /** */

        for (let i = 1; i < 96 - info.age; i++) {

            outCome = sumArray(payList, (Number)(info.age) + i)

            inCome =
                Number(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1,  info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori) +
                Number(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1,  wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori) +
                sumArray(incomeList, (Number)(info.age) + i)

            Result = inCome - outCome


            data.push(
                {
                    name: Number(info.age) + i + "歳",
                    saving: Math.floor(Result + Number(data[i - 1].saving)),
                    income: Math.floor(inCome)
                })
            if ((Result + Number(data[i - 1].saving) < 0)) {
                minus_data.push(
                    {
                        name: Number(info.age) + i + "歳",
                        saving: data[i].saving
                    }

                )
                // マイナスがあることを通知
                minusFlag = true;
            }

            // 表のデータをプッシュ
            tableData.push(
                {
                    year: i + "年",
                    age: Number(info.age) + i + "歳",
                    wage: Number(wifeInfo.age) + i + "歳",
                    self: Math.floor(dicisionInfo(info.taxIncome, info.taxIncome60, info.rate, info.maxAge1, info.afterIncome, info.pension, huyoList, 0, info.age, i)[0].tedori),
                    wife: Math.floor(dicisionInfo(wifeInfo.taxIncome, wifeInfo.taxIncome60, wifeInfo.rate, wifeInfo.maxAge1,  wifeInfo.afterIncome, wifeInfo.pension, huyoList, 1, wifeInfo.age, i)[0].tedori),
                    income: Math.floor(inCome),
                    outcome: Math.floor(outCome),
                    expenses: Math.floor(Result),
                    saving: Math.floor(data[i].saving)
                }
            )
        }

        // マイナスがある場合要素0に1を代入
        if (minusFlag) {
            minus_data[0] = minus_data[1]
        }
        // ない場合要素1に0,0を代入
        else {
            minus_data.push(
                {
                    name: 0,
                    saving: 0
                }
            )
        }

        for (let i = 0; i < data.length; i++) {
            cdata.push({
                年齢: data[i].name,
                貯蓄: data[i].saving,
                収入: data[i].income
            })
        }

        for (let i = 1; i < data.length; i++) {
            if (data[i - 1].saving > 0 && data[i].saving < 0) {
                minusAge.push(Number(info.age) + i);
            }
        }

        setMinusAgeState(minusAge);
        setChartData(cdata);
        setMinusYear(minus_data[1].name)
        setMinusSum((minus_data[minus_data.length - 1].saving))
        setTData(tableData)
        setLastSaving(tableData[tableData.length - 1].saving)

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
                                <Area type="monotone" dataKey="収入" fill="#82ca9d" stroke="#82ca9d" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="tr-txt">
                        {minusYear !== 0 ?
                            <>
                                {minusAgeState.map((age, i) => <p key={i}>貯蓄がマイナスになるのは : {age}歳</p>)}
                                <br />
                                95歳までのマイナス累計額 : {Math.floor(minusSum)}万円
                            </> :
                            <>
                                95歳の時の貯蓄 : {lastSaving}万円
                            </>}
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
                            { title: '累計貯蓄額', field: 'saving' },
                        ]
                        }

                        data={tData}
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