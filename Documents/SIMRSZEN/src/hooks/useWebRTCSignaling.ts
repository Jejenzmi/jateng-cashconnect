export function useWebRTCSignaling() {
  return {
    sendOffer: async (_offer: RTCSessionDescriptionInit, _targetId: string) => {},
    sendAnswer: async (_answer: RTCSessionDescriptionInit, _targetId: string) => {},
    sendCandidate: async (_candidate: RTCIceCandidateInit, _targetId: string) => {},
    onOffer: (_callback: (offer: RTCSessionDescriptionInit, from: string) => void) => {},
    onAnswer: (_callback: (answer: RTCSessionDescriptionInit, from: string) => void) => {},
    onCandidate: (_callback: (candidate: RTCIceCandidateInit, from: string) => void) => {},
  };
}
