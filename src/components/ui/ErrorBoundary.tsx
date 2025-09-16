"use client";
import { Component, ReactNode } from "react";
import ErrorModal from "./ErrorModal";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export default class ClientErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.setState({ hasError: true, error });
  }

  handleClose = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <>
          <ErrorModal
            open={true}
            title="Something went wrong"
            message={this.state.error.message}
            onClose={this.handleClose}
          />
          {this.props.children}
        </>
      );
    }

    return this.props.children;
  }
}
