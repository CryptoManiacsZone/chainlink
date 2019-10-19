pragma solidity 0.5.0;

import "../vendor/Ownable.sol";
import "../interfaces/LinkTokenInterface.sol";

/**
 * @title The PushAggregator handles aggregating data pushed in from off-chain.
 */
contract PushAggregator is Ownable {

  int256 public currentAnswer;
  uint256 public answerRound;
  uint256 public oracleCount;
  LinkTokenInterface private LINK;
  mapping(address => bool) private oracles;

  constructor(address _link) public {
    LINK = LinkTokenInterface(_link);
  }

  function updateAnswer(int256 _answer) public {
    require(oracles[msg.sender], "Only updatable by designated oracles");

    currentAnswer = _answer;
    answerRound += 1;
  }

  function addOracle(address _oracle) public onlyOwner {
    require(!oracles[_oracle], "Address is already recorded as an oracle");

    oracles[_oracle] = true;
    oracleCount += 1;
  }

  function removeOracle(address _oracle) public onlyOwner {
    require(oracles[_oracle], "Address is not an oracle");
    oracles[_oracle] = false;
    oracleCount -= 1;
  }

}