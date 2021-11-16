import { useState, useEffect, memo } from "react"
import { FormInput } from "./FormInput"

const InputIncome = memo((props) => {
    const { addIncomeList } = props
    const [open, setOpen] = useState(false)
    const [type, setType] = useState("")
    const [charge, setCharge] = useState("")
    const [count, setCount] = useState("")
    const [type2, setType2] = useState("")


    const decisionThisIncome = () => {
        setOpen(false)
        const S = "1234567890";
        const N = 9;
        const number = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join('');
        addIncomeList(Number(number), type, charge, count, type2)
        setType("house")
        setCharge("")
        setCount("")
        setType2("")
    }

    const deleteThisIncome = () => {
        setOpen(false)
        setType("house")
        setCharge("")
        setCount("")
        setType2("")
    }

    return (
        <>
            {open ?
                <div className="option-wrapper">
                    <label className="button-label">給与以外の収入</label>
                    <br />
                    <div class="cp_ipselect">
                        <select class="cp_sl06" required onChange={(e) => { setType(e.target.value) }}>
                            <option value="" hidden disabled selected></option>
                            <option value="retire">退職金</option>
                            <option value="yachin">家賃収入</option>
                            <option value="nenkin">個人年金</option>
                            <option value="nenkinW">配偶者の個人年金</option>
                            <option value="other">その他収入</option>
                        </select>
                        <span class="cp_sl06_highlight"></span>
                        <span class="cp_sl06_selectbar"></span>
                        <label class="cp_sl06_selectlabel">種類</label>
                    </div>
                    <br />
                    <FormInput label="金額（年額）" type="number" value={charge} onChange={(e) => { setCharge(e.target.value) }} />
                    <br />
                    <div class="cp_ipselect">
                        <select class="cp_sl06" required onChange={(e) => { setType2(e.target.value) }}>
                            <option value="" hidden disabled selected></option>
                            <option value="every">毎年</option>
                            <option value="before">歳まで毎年</option>
                            <option value="after">歳から毎年</option>
                            <option value="once">歳の時に1回限り</option>
                        </select>
                        <span class="cp_sl06_highlight"></span>
                        <span class="cp_sl06_selectbar"></span>
                        <label class="cp_sl06_selectlabel">期間</label>
                    </div>
                    <br />
                    {type2 !== "every"?
                        <>
                            <FormInput label="年齢（歳）" type="number" value={count} onChange={(e) => { setCount(e.target.value) }} />
                            <br />
                        </>
                    : null}

                    <div className="button-wrapper">
                        <button className="btn btn-border" onClick={decisionThisIncome}>決定</button>
                        <button className="btn btn-border" onClick={deleteThisIncome}>削除</button>
                    </div>

                </div>
                :
                <label className="button-label">
                    <button className="btn btn-border" onClick={() => { setOpen(true) }}>追加</button>
                </label>
                }

        </>
    )
})

export default InputIncome