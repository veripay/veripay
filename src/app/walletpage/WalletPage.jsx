import './WalletPage.scss'
import {Component} from "react";
import defaultProfileImage from "../../assets/defaultProfileImage.png"
import {Link} from "react-router-dom";
import {formatDateShort, formatMoney} from "../utils.jsx";
import Cookies from "js-cookie";

export default class WalletPage extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    Cookies.remove("athlete-id");
    this.props.updateLogin();
  }

  render() {
    return <>
      <div className="top-bar">
        <img src={defaultProfileImage} alt="Profile" onClick={this.logout}/>
        <h3>{this.props.database.loaded ? this.props.database.getLoggedInAthlete().name : ""}</h3>
        <Link className={"material-symbols-rounded settings-gear"} >
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

export function Transaction({amount, isWithdrawal, memo, date}) {
  return <div className="transaction-container">
    <div className={"top-row"}>
      <p>{memo}</p>
      <p className={"date"}>{formatDateShort(new Date(date))}</p>
    </div>
    <h2 className={isWithdrawal ? "withdrawal" : ""}>{isWithdrawal ? '- ' : '+ '}${formatMoney(amount)}</h2>
  </div>
}