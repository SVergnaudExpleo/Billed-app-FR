import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import Bills from "../containers/Bills"
import firebase from "../__mocks__/firebase"
import { ROUTES } from "../constants/routes.js"
import {icon1HighLight} from "../app/Router"

describe("Given I am connected as an employee", () => {
  // connection comme employée //
    beforeEach(()=>{
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
    });
  // ajouter le onNavigate pour déclencher le router

  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: bills})
      document.body.innerHTML = html
      const icone = screen.getByTestId("icon-window")
      expect(icone).toBeTruthy()
      icon1HighLight()
      expect(icone.className).toBe("active-icon")
    });

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    });
  
    test("Then user click on new bill button, buttton is called", ()=>{
      const onNavigate = (pathname) => {
        document.body.innerHTML = BillsUI({ data: bills })
      };
      const billContainer = new Bills({document,onNavigate,firestore:null,LocalStorage: window.localStorage});
      expect(billContainer).toBeTruthy;

      const buttonNewbill = screen.getByTestId("btn-new-bill");
      expect (buttonNewbill).toBeTruthy;

      buttonNewbill.click();
      expect (buttonNewbill).toBeCalled;
    });

    test("Then user click on eyes button, button is called",()=>{
      const onNavigate = (pathname) => {
        document.body.innerHTML = BillsUI({ data: bills })
      };
      $.fn.modal=jest.fn;
      const billContainer = new Bills({document,onNavigate,firestore: null,LocalStorage: window.localStorage});
      expect(billContainer).toBeTruthy;

      const buttonEye = screen.getAllByTestId("icon-eye");
      expect (buttonEye).toBeTruthy;

      buttonEye[0].click();
      expect(buttonEye).toBeCalled;
    });
  });

  describe("When I navigate to bils", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    });
  });
});
