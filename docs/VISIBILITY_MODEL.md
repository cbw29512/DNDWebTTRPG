# Visibility and Projection Model

The authoritative encounter contains every card face, actor statistic, private note, audience rule, and event. A participant must never receive that complete object directly.

## Roles

- **DM:** receives the complete encounter projection.
- **Player:** receives revealed world cards, public actor information, and full data only for actors they control.

## Card audiences

- `dm-only`
- `everyone`
- `controller`
- `selected`

A facedown or unauthorized card is omitted from the player projection entirely. It is not sent with hidden CSS or a concealed DOM node.

## Actor information

Players may receive public identity, initiative, and descriptive injury state for visible monsters. Exact monster HP, AC, tactics, reactions, and private notes remain absent. A player receives full state for their own controlled character.

## Prototype review switch

The static prototype includes a DM View / Player View switch. This is a visual inspection tool, not authentication. Both views are produced from the same canonical Ruined Chapel session using `projectSessionFor`.

## Server requirement

The future WebSocket server must build a fresh participant-specific projection after every accepted command. Authorization and projection tests must run server-side before data is transmitted.
