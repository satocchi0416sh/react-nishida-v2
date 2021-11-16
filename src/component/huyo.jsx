import { useState, memo } from "react"
import './Select_module.css'
import { FormInput } from "./FormInput";

const Huyo = memo((props) => {
    const { number, deleteHuyoInput ,type,childAge,numberOfHuyo,self,editHuyoInput} = props
    const [open, setOpen] = useState(true)
    const [edit,setEdit]=useState(false)
    const [newType,setNewType]=useState(type)
    const [newChildAge,setNewChildAge]=useState(childAge)
    const [newNumberOfHuyo,setNewNumberOfHuyo]=useState(numberOfHuyo)
    const [newSelf,setNewSelf]=useState(self)

    const deleteThisHuyo = () => {
        setOpen(false)
        deleteHuyoInput(number)
    }
    const editThisHuyo=()=>{
        editHuyoInput(number, newType, newChildAge, newNumberOfHuyo, newSelf)
        setEdit(false)
    }

    let typeLabel;
    if (newType === "child") {
        typeLabel = " 扶養~22歳"
    } else if (newType === "wife") {
        typeLabel = " 配偶者"
    } else if (newType === "other") {
        typeLabel = " その他扶養"
    } else if (newType === "senior1") {
        typeLabel = " 老人同居"
    } else {
        typeLabel = " 老人別居"
    }
    return (
        <div>
            {open ?
                <>
                {edit ?
                    <div className="option-wrapper">
                    <div class="cp_ipselect">
                        <select class="cp_sl06" required value={newType} onChange={(e) => { setNewType(e.target.value) }}>
                            <option value="" hidden disabled selected></option>
                            <option value="wife">配偶者</option>
                            <option value="child">扶養~22</option>
                            <option value="other">扶養その他</option>
                            <option value="senior1">老人(70歳以上)同居</option>
                            <option value="senior2">老人(70歳以上)別居</option>
                        </select>
                        <span class="cp_sl06_highlight"></span>
                        <span class="cp_sl06_selectbar"></span>
                        <label class="cp_sl06_selectlabel">扶養控除の種類</label>
                    </div>
                    <br />

                    {newType === "child" ?
                        <>
                            <FormInput label="年齢（歳）" type="number" value={newChildAge} onChange={(e) => { setNewChildAge(e.target.value) }} />
                        </>
                        :
                        <>
                            <FormInput label="人数" type="number" value={newNumberOfHuyo} onChange={(e) => { setNewNumberOfHuyo(e.target.value) }} />
                        </>
                    }

                    <br />
                    <div class="cp_ipselect">
                        <select class="cp_sl06" required value={newSelf} onChange={(e) => { setNewSelf(e.target.value) }}>
                            <option value="" hidden disabled selected></option>
                            <option value="0">本人</option>
                            <option value="1">配偶者</option>
                        </select>
                        <span class="cp_sl06_highlight"></span>
                        <span class="cp_sl06_selectbar"></span>
                        <label class="cp_sl06_selectlabel">控除対象者</label>
                    </div>
                    <br />

                    <div className="button-wrapper">
                        <button className="btn btn-border" onClick={editThisHuyo}>決定</button>
                    </div>
                </div>
                :
                <div className="option-wrapper">
                        <>
                            <br />
                            <label>扶養控除の種類 :
                                {typeLabel}
                                <br />
                                <br />
                                {newType === "child" ?
                                    <>
                                        <label>年齢 : {newChildAge}歳</label>
                                    </>
                                    :
                                    <>
                                        <label>人数 : {newNumberOfHuyo}人</label>
                                    </>
                                }
                                <br />
                            </label>

                            <label>対象 :
                                {newSelf===0 ?
                                    " 本人"
                                    :
                                    " 配偶者"}

                                <br />
                            </label>
                            <button className="btn btn-border" onClick={()=>{setEdit(true)}}>編集</button>
                            <button className="btn btn-border" onClick={deleteThisHuyo}>削除</button>
                        </>
                </div>
                }
                </>
            :
            null}          
        </div>
    )
})

export default Huyo