import { useState, memo } from "react"
import './Select_module.css'
import { FormInput } from "./FormInput";

const Pay = memo((props) => {
    const { number, type, charge, count, type2, deletePayInput, editPayInput } = props
    const [open, setOpen] = useState(true)
    const [edit, setEdit] = useState(false)
    const [newType, setNewType] = useState(type)
    const [newCharge, setNewCharge] = useState(charge)
    const [newCount, setNewCount] = useState(count)
    const [newType2, setNewType2] = useState(type2)


    const deleteThisPay = () => {
        setOpen(false)
        deletePayInput(number)
    }
    const editThisPay = () => {
        if (newType !== "sisanTax"){
            setNewCharge(newCharge*12)
            editPayInput(number, newType, newCharge * 12, newCount, newType2)
        }else{
            editPayInput(number, newType, newCharge, newCount, newType2)
        }
        setEdit(false)
        
    }

    /**
     * <option value="" hidden disabled selected></option>
                                <option value="house">住宅ローン　家賃　等</option>
                                <option value="house2">住まい関連の費用（管理費など)</option>
                                <option value="sisanTax">固定資産税</option>
                                <option value="car">車やその他（ローン）</option>
                                <option value="seimeiHoken">生命保険</option>
                                <option value="study">学費など</option>
                                <option value="living">65歳までの月々の生活費</option>
                                <option value="living65">65歳以降の月々の生活費</option>
                                <option value="other">その他の支出</option>
     */

    let typeLabel1;
    if (newType === "house") {
        typeLabel1 = "住宅ローン、家賃"
    } else if (newType === "house2") {
        typeLabel1 = "住まい関連の費用（管理費など)"
    } else if (newType === "car") {
        typeLabel1 = "車（ローン）"
    } else if (newType === "nomal") {
        typeLabel1 = "一般支出"
    } else if (newType === "sisanTax") {
        typeLabel1 = "固定資産税"
    } else if (newType === "seimeiHoken") {
        typeLabel1 = "生命保険"
    } else if (newType === "study") {
        typeLabel1 = "学費など"
    } else if (newType === "other") {
        typeLabel1 = "その他の支出"
    } else if (newType === "living") {
        typeLabel1 = "65歳までの月々の生活費"
    } else {
        typeLabel1 = "65歳以降の月々の生活費"
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
                            <>
                                <div class="cp_ipselect">
                                    <select class="cp_sl06" required value={newType} onChange={(e) => { setNewType(e.target.value) }}>
                                        <option value="" hidden disabled selected></option>
                                        <option value="house">住宅ローン　家賃　等</option>
                                        <option value="house2">住まい関連の費用（管理費など)</option>
                                        <option value="sisanTax">固定資産税</option>
                                        <option value="car">車やその他（ローン）</option>
                                        <option value="seimeiHoken">生命保険</option>
                                        <option value="study">学費など</option>
                                        <option value="other">その他の支出</option>
                                    </select>
                                    <span class="cp_sl06_highlight"></span>
                                    <span class="cp_sl06_selectbar"></span>
                                    <label class="cp_sl06_selectlabel">種類</label>
                                </div>
                                <br />
                                {newType !== "sisanTax"
                                    ?
                                    <FormInput label="金額（月額）" type="number" value={newCharge} onChange={(e) => { setNewCharge(e.target.value) }} />
                                    :
                                    <FormInput label="金額（年額）" type="number" value={newCharge} onChange={(e) => { setNewCharge(e.target.value) }} />
                                }
                                <br />
                                {newType === "living" || newType === "living65" ?
                                    null
                                    :
                                    <>
                                        <div class="cp_ipselect">
                                            <select class="cp_sl06" required value={newType2} onChange={(e) => { setNewType2(e.target.value) }}>
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
                                                <FormInput label="年齢" type="number" value={newCount} onChange={(e) => { setNewCount(e.target.value) }} />
                                                <br />
                                            </>
                                            : null}
                                    </>
                                }

                                <div className="button-wrapper">
                                    <button className="btn btn-border" onClick={editThisPay}>決定</button>
                                </div>
                            </>

                        </div>
                        :
                        <div className="option-wrapper">
                            <br />
                            <label>種類 : {typeLabel1}</label>
                            <br />
                            <label>金額（年額） : {newCharge}万円</label>
                            <br />
                            {type2 === "every" ?
                                <label>期間 : {typeLabel2}</label> :
                                <label>期間 : {newCount}歳{typeLabel2}</label>
                            }
                            <button className="btn btn-border"
                                onClick={() => {
                                    setEdit(true)
                                    if (type !== "sisanTax") {
                                        console.log(newCharge)
                                        setNewCharge(prevNewCharge => prevNewCharge / 12)
                                        console.log(newCharge)
                                    }
                                }}>編集</button>
                            <button className="btn btn-border" onClick={deleteThisPay}>削除</button>
                        </div>
                    }

                </>
                : null}

        </>
    )
})

export default Pay