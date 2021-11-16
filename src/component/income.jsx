import { useState, memo } from "react"
import './Select_module.css'
import { FormInput } from "./FormInput"

const Income = memo((props) => {
    const { number, type, charge, count, type2, deleteIncomeInput, editIncomeInput } = props
    const [open, setOpen] = useState(true)
    const [edit, setEdit] = useState(false)
    const [newType, setNewType] = useState(type)
    const [newCharge, setNewCharge] = useState(charge)
    const [newCount, setNewCount] = useState(count)
    const [newType2, setNewType2] = useState(type2)

    const deleteThisIncome = () => {
        setOpen(false)
        deleteIncomeInput(number)
    }

    const editThisIncome = () => {
        setEdit(false)
        editIncomeInput(number, newType, newCharge, newCount, newType2)
    }

    let typeLabel1;
    if (newType === "retire") {
        typeLabel1 = "退職金（万円）"
    } else if (newType === "other") {
        typeLabel1 = "その他収入（万円）"
    } else if (newType === "yachin") {
        typeLabel1 = "家賃収入（万円）"
    } else if (newType === "nenkin") {
        typeLabel1 = "個人年金（万円）"
    } else if (newType === "nenkinW") {
        typeLabel1 = "個人年金配偶者（万円）"
    } else {
        typeLabel1 = "その他（万円）"
    }

    let typeLabel2;
    if (newType2 === "every") {
        typeLabel2 = "毎年"
    } else if (newType2 === "before") {
        typeLabel2 = "まで毎年"
    } else if (newType2 === "after") {
        typeLabel2 = "から毎年"
    } else {
        typeLabel2 = "の時に1回限り"
    }

    return (
        <>
            {open ?
                <>
                    {edit ?
                        <div className="option-wrapper">
                            <label className="button-label">給与以外の収入</label>
                            <br />
                            <div class="cp_ipselect">
                                <select class="cp_sl06" required value={newType} onChange={(e) => { setNewType(e.target.value) }}>
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
                            <FormInput label="金額（年額）" type="number" value={newCharge} onChange={(e) => { setNewCharge(e.target.value) }} />
                            <br />
                            <div class="cp_ipselect">
                                <select class="cp_sl06" value={newType2} required onChange={(e) => { setNewType2(e.target.value) }}>
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
                            {newType2 !== "every" ?
                                <>
                                    <FormInput label="年齢（歳）" type="number" value={newCount} onChange={(e) => { setNewCount(e.target.value) }} />
                                    <br />
                                </>
                            : null}
                            


                            <div className="button-wrapper">
                                <button className="btn btn-border" onClick={editThisIncome}>決定</button>
                            </div>

                        </div>
                        :
                        <div className="option-wrapper">
                            <br />
                            <label>種類 : {typeLabel1}</label>
                            <br />
                            <label>金額（年額） : {Math.floor(newCharge)}万円</label>
                            <br />
                            {newType2 === "every" ?
                                <label>期間 : {typeLabel2}</label> :
                                <label>期間 : {newCount}歳{typeLabel2}</label>
                            }
                            <button className="btn btn-border"
                                onClick={() => {setEdit(true)}}>編集</button>
                            <button className="btn btn-border" onClick={deleteThisIncome}>削除</button>
                        </div>
                    }

                </>
                : null}

        </>
    )
})

export default Income