# WardSonar

## Project Overview
Wardsonar is a web application designed to collect and visualize real-time patient feedback on hospital ward environments. It provides a straightforward interface for patients to submit their mood, direction of change, and contributing factors, while offering staff and managers dedicated dashboards to monitor and analyze this feedback. The goal is to empower healthcare providers with actionable insights to improve patient experience and ward conditions.

## Features
### Patient Feedback Submission:

- Intuitive interface for patients to rate their atmosphere (mood), indicate direction of change (better, same, worse), and provide comments.

- Ability to select contributing factors (e.g., ward environment, staff, other patients).

- Staff Login & Ward-Specific Dashboard:

- Secure login for staff using a unique Ward ID and PIN.

- Dashboard displaying aggregated feedback data specific to their ward.

- Visualizations for mood responses (bar chart), direction of change (meter), and contributing factors (pie chart).

### Manager Login & Multi-Ward Dashboard:

- Secure login for managers with a username and password.

- Ability to select and view dashboards for any ward under their purview.

- Overview of total responses for the selected ward.

- Visualizations mirroring staff dashboards for comprehensive oversight.

- Data Storage: Persistent storage of feedback data using PostgreSQL.

- Responsive Design: Accessible and functional across various devices.
