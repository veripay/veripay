import './WalletPage.scss'
import {Component} from "react";
import defaultProfileImage from "../../assets/defaultProfileImage.png"
import {Link} from "react-router-dom";
import {formatDateShort, formatMoney} from "../utils.jsx";

export default class WalletPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <>
      <div className="top-bar">
        <img src={defaultProfileImage} alt="Profile"/>
        <h3>Bob Dylan</h3>
        <Link className={"material-symbols-rounded settings-gear"} to="/app/settings">
          Settings
        </Link>
      </div>

      <div className="balance-container">
        <h2>${formatMoney(this.props.database.getFilteredTransactions().reduce((prev, next) => prev + (next.amount * (next.isWithdrawal ? -1 : 1)), 0))}</h2>
      </div>
      <div className="transactions">
        {this.props.database.getFilteredTransactions(true).map(transaction => <Transaction key={transaction.id} {...transaction} />)}
      </div>
    </>;
  }
}

function Transaction({amount, isWithdrawal, memo, date}) {
  return <div className="transaction-container">
    <div className={"top-row"}>
      <p>{memo}</p>
      <p className={"date"}>{formatDateShort(new Date(date))}</p>
    </div>
    <h2 className={isWithdrawal ? "withdrawal" : ""}>{isWithdrawal ? '- ' : '+ '}${formatMoney(amount)}</h2>
  </div>
}