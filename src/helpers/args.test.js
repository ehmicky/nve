export const printVersionArgs = ['node', '--version']

// Works on TEST_VERSION but not on OLD_TEST_VERSION
export const printModernNodeArgs = ['node', '-p', '".".at(0)']
