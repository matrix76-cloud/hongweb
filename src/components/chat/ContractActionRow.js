// ContractActionRow.js
import React from 'react';
import InfoBoxItem from './InfoBoxItem';
import { CHATCONTENTTYPE } from '../../utility/screen';

const ContractActionRow = ({ data, handlers }) => {
    const {
        _handlePurchase,
        _handlecomplete,
        _handleReview
    } = handlers;

    switch (data.CHAT_CONTENT_TYPE) {
        case CHATCONTENTTYPE.RIGHTSIGN:
            return <InfoBoxItem data={data} />;
        case CHATCONTENTTYPE.LEFTSIGN:
            return (
                <InfoBoxItem
                    data={data}
                    singlebutton
                    buttonText1="결제(의뢰자분 클릭)"
                    callback1={_handlePurchase}
                />
            );
        case CHATCONTENTTYPE.PURCHASE:
            return (
                <InfoBoxItem
                    data={data}
                    singlebutton
                    buttonText1="계약서 일감 완료(일꾼)"
                    callback1={_handlecomplete}
                />
            );
        case CHATCONTENTTYPE.COMPLETE:
            return (
                <InfoBoxItem
                    data={data}
                    singlebutton
                    buttonText1="평가하기(의뢰인)"
                    callback1={_handleReview}
                />
            );
        case CHATCONTENTTYPE.REVIEW:
            return <InfoBoxItem data={data} />;
        default:
            return null;
    }
};

export default ContractActionRow;
