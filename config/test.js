/**
 * Configuration file to be used while running tests
 */

module.exports = {
  ADMIN_TOKEN: process.env.ADMIN_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBZG1pbmlzdHJhdG9yIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6IlRvbnlKIiwiZXhwIjo1NTUzMDE5OTI1OSwidXNlcklkIjoiNDA0MzMyODgiLCJpYXQiOjE1MzAxOTg2NTksImVtYWlsIjoiYWRtaW5AdG9wY29kZXIuY29tIiwianRpIjoiYzNhYzYwOGEtNTZiZS00NWQwLThmNmEtMzFmZTk0Yjk1NjFjIn0.IePmZQny5cu7l5TTgz4IW9rM4ZyZ3rL-h4fasOVpDuU',
  COPILOT_TOKEN: process.env.COPILOT_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJDb3BpbG90Il0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6ImNhbGxtZWthdG9vdGllIiwiZXhwIjo1NTUzMDE5OTI1OSwidXNlcklkIjoiNDA0OTMwMTIiLCJpYXQiOjE1MzAxOTg2NTksImVtYWlsIjoiY2FsbG1la2F0b290aWVAdG9wY29kZXIuY29tIiwianRpIjoiYzNhYzYwOGEtNTZiZS00NWQwLThmNmEtMzFmZTk0Yjk1NjFjIn0.h_CEJkWhIIIkcu35j2G-swmjQZMj0LPZ_9yol-FCFdE',
  USER_TOKEN: process.env.USER_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6InRlc3Rpbmd1c2VyMTIzIiwiZXhwIjo1NTUzMDE5OTI1OSwidXNlcklkIjoiODU0Nzg5OSIsImlhdCI6MTUzMDE5ODY1OSwiZW1haWwiOiJ0ZXN0aW5ndXNlcjEyM0B0b3Bjb2Rlci5jb20iLCJqdGkiOiJjM2FjNjA4YS01NmJlLTQ1ZDAtOGY2YS0zMWZlOTRiOTU2MWMifQ.9v84MytRlHXH4KTKPosJN0i2SRNQeyS_FoCL3QDIJG4',
  EXPIRED_TOKEN: process.env.EXPIRED_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBZG1pbmlzdHJhdG9yIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6IlRvbnlKIiwiZXhwIjo1MzAxOTkyNTksInVzZXJJZCI6IjQwNDMzMjg4IiwiaWF0IjoxNTMwMTk4NjU5LCJlbWFpbCI6ImFkbWluQHRvcGNvZGVyLmNvbSIsImp0aSI6ImMzYWM2MDhhLTU2YmUtNDVkMC04ZjZhLTMxZmU5NGI5NTYxYyJ9.oHUF3JCTUlXIgonXTDIWw9hxtwVVe4q_0TlF0URnxnE',
  INVALID_TOKEN: process.env.INVALID_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJBZG1pbmlzdHJhdG9yIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6IlRvbnlKIiwiZXhwIjo1MzAxOTkyNTksInVzZXJJZCI6IjQwNDMzMjg4IiwiaWF0IjoxNTMwMTk4NjU5LCJlbWFpbCI6ImFkbWluQHRvcGNvZGVyLmNvbSIsImp0aSI6ImMzYWM2MDhhLTU2YmUtNDVkMC04ZjZhLTMxZmU5NGI5NTYxYyJ9.oHUF3JCTUlXIgonXTDIWw9hxtwVVe4q_0TlF0URnxnE',
  M2M_FULL_ACCESS_TOKEN: process.env.M2M_FULL_ACCESS_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOiJhbGw6c2NvcmVfc3lzdGVtIGFsbDpzY29yZWNhcmQiLCJzdWIiOiJ0ZXN0IiwiaXNzIjoiaHR0cHM6Ly9hcGkudG9wY29kZXIuY29tIiwiZXhwIjo1NTUzMDE5OTI1OSwiaWF0IjoxNTMwMTk4NjU5LCJqdGkiOiJjM2FjNjA4YS01NmJlLTQ1ZDAtOGY2YS0zMWZlOTRiOTU2MWMifQ.DB5cEIMQD6JoAZn8ABNZ8L60Iiniulb0XJKFnCpGDuQ',
  M2M_READ_ACCESS_TOKEN: process.env.M2M_READ_ACCESS_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOiJyZWFkOnNjb3JlX3N5c3RlbSByZWFkOnNjb3JlY2FyZCIsInN1YiI6InRlc3QiLCJpc3MiOiJodHRwczovL2FwaS50b3Bjb2Rlci5jb20iLCJleHAiOjU1NTMwMTk5MjU5LCJpYXQiOjE1MzAxOTg2NTksImp0aSI6ImMzYWM2MDhhLTU2YmUtNDVkMC04ZjZhLTMxZmU5NGI5NTYxYyJ9.kkIO3WE2Pn86RHkbYOPErdyFMcW0DKUopC0sB2sFC5w',
  M2M_UPDATE_ACCESS_TOKEN: process.env.M2M_UPDATE_ACCESS_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOiJ1cGRhdGU6c2NvcmVfc3lzdGVtIHVwZGF0ZTpzY29yZWNhcmQiLCJzdWIiOiJ0ZXN0IiwiaXNzIjoiaHR0cHM6Ly9hcGkudG9wY29kZXIuY29tIiwiZXhwIjo1NTUzMDE5OTI1OSwiaWF0IjoxNTMwMTk4NjU5LCJqdGkiOiJjM2FjNjA4YS01NmJlLTQ1ZDAtOGY2YS0zMWZlOTRiOTU2MWMifQ._VOGmADFT3RGry0Iy-U2Km9F7-uER06XYU2U88T75mQ'
}