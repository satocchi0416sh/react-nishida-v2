import { useState, memo } from "react"
import './Select_module.css'
import { FormInput } from "./FormInput"

const InputHuyo = memo((props) => {
    const { addHuyoList } = props
    const [open, setOpen] = useState(false)
    const [type, setType] = useState("wife")
    const [childAge, setChildAge] = useState('')
    const [numberOfHuyo, setNumberOfHuyo] = useState('')
    const [self, setSelf] = useState('')


    const decisionThisHuyo = () => {
        setOpen(false)
        const S = "1234567890";
        const N = 9;
        const number = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join('');
        addHuyoList(Number(number), type, childAge, numberOfHuyo, Number(self))
        setType("wife")
        setChildAge("")
        setNumberOfHuyo("")
        setSelf("")
    }

    const deleteThisHuyo = () => {
        setOpen(false)
        setType("wife")
        setChildAge("")
        setNumberOfHuyo("")
        setSelf("")
    }

    return (
        <div>
            {open ?
                <div className="option-wrapper">
                    <div className="wrapper-">
                        <div className="huyo-wrapper">
                            <label className="button-label">扶養控除</label>
                            <div class="cp_tooltip"><i class="fas fa-info-circle"></i>
                                <span class="cp_tooltiptext">
                                    <p>▶️配偶者</p>
                                    <p>
                                        配偶者の年間所得が48万円以下(給与所得のみだと給与収入103万円以下)の場合は、配偶者控除が受けられます。該当する場合は設定してください。
                                        <br />(扶養額: 38万円)
                                    </p>
                                    <p>▶️扶養〜22</p>
                                    <p>
                                        お子さんの扶養の設定をします。現在15歳以下のお子さんも、16歳以上になった時にはシミュレーション結果に反映されるため、年齢に関わらずお子さん全員分を入力してください。
                                    </p>
                                    <p>
                                        (扶養額: 15歳まで⇨0万円、16〜18歳⇨38万円、19〜22歳⇨63万円)
                                    </p>
                                </span>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div class="cp_ipselect">
                        <select class="cp_sl06" required onChange={(e) => { setType(e.target.value) }}>
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

                    {type === "child" ?
                        <>
                            <FormInput label="年齢（歳）" type="number" value={childAge} onChange={(e) => { setChildAge(e.target.value) }} />
                        </>
                        :
                        <>
                            <FormInput label="人数" type="number" value={numberOfHuyo} onChange={(e) => { setNumberOfHuyo(e.target.value) }} />
                        </>
                    }

                    <br />
                    <div class="cp_ipselect">
                        <select class="cp_sl06" required onChange={(e) => { setSelf(e.target.value) }}>
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
                        <button className="btn btn-border" onClick={decisionThisHuyo}>決定</button>
                        <button className="btn btn-border" onClick={deleteThisHuyo}>削除</button>
                    </div>
                </div>
                :
                <label className="button-label">
                    <button className="btn btn-border" onClick={() => { setOpen(true) }}>追加</button>
                </label>}
        </div>
    )
})

export default InputHuyo