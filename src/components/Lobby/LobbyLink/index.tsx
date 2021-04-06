import React from "react";
import { Button } from "components/Button";
import { Trans } from "react-i18next";
import "./style.scss";


export class LobbyLink extends React.Component<{}, { tooltipVisible: boolean }>
{
  supportsCopying: boolean = false;

  constructor(props: {}) {
    super(props);
    this.state = { tooltipVisible: false }
    this.supportsCopying = !!document.queryCommandSupported("copy");
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.setTooltipVisible = this.setTooltipVisible.bind(this);
  }
  copyToClipboard(value: string) {
    var textField = document.createElement("textarea");
    textField.innerText = value;
    textField.style.opacity = "0";
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }

  setTooltipVisible(value: boolean) {
    this.setState({ tooltipVisible: value });
  }

  render() {
    return (
      <div className="LobbyLink__link" >
        <div className="LobbyLink__link-box">{window.location.href}</div>
        { this.supportsCopying && (
          <div className="LobbyLink__link-button">
              {this.state.tooltipVisible && (
              <div className="LobbyLink__tooltip">
                 <Trans>Copied!</Trans>
              </div>
              )}
            <Button
              onClick={() => {
                this.copyToClipboard(window.location.href);
                this.setTooltipVisible(true);
                setTimeout(() => this.setTooltipVisible(false), 1500);
              }}
            >
              <Trans>Copy</Trans>
            </Button>
          </div>
        )}
      </div >
    )
  }
}