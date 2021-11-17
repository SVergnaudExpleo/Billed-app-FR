import { screen, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes"
import firebasePost from "../__mocks__/firebasePost"

describe("Given I am connected as an employee", () => {

  // connection comme employée //
  beforeEach(()=>{
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }));
  });

  describe("When I am on NewBill Page", () => {
    test("Then user set wrong file format, alert must be display", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        null
      };
      window.alert = jest.fn();
      const uiOk = screen.getByTestId("form-new-bill");
      expect(uiOk).toBeTruthy;
      
      const newBillContainer = new NewBill({document,onNavigate,firestore:null,LocalStorage: null});
      expect(newBillContainer).toBeTruthy;

      const file = screen.getByTestId("file");
      expect(file).toBeTruthy;

      fireEvent.change(file, {
        target: {
          files: [new File(['file content'],'mauvais-type.txt',{type: 'text/plain', name: 'mauvais-type.txt'})],
        }
      });
      expect(window.alert).toBeCalled();
    });

    test("Then user set the good file format, no alert must be display", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      };
      const uiOk = screen.getByTestId("form-new-bill");
      expect(uiOk).toBeTruthy;
      window.alert = jest.fn();

      const newBillContainer = new NewBill({document,onNavigate,firestore: null ,LocalStorage:window.localStorage });
      expect(newBillContainer).toBeTruthy;

      const file = screen.getByTestId("file");
      expect(file).toBeTruthy;

      fireEvent.change(file, {
        target: {
          files: [new File(['file content'],'bon-type.png',{type: 'image/png', name:'bon-type.png'})],
        }
      })
      expect(window.alert).not.toBeCalled()
    });

    test("Then on submit, the form must be submit", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      };
      const newBillContainer = new NewBill({document,onNavigate,firestore: null,LocalStorage: window.localStorage});
      const form = screen.getByTestId("form-new-bill");
      expect(form).toBeTruthy;
      fireEvent.submit(form)
      expect(form.onsubmit).toBeTruthy;
    });
  });
});

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to NewBills", () => {
    test("fetches bills from mock API POST", async () => {
        const getSpy = jest.spyOn(firebasePost, "post")
        const bills = await firebasePost.post()
        expect(getSpy).toHaveBeenCalledTimes(1)
        expect(bills.data.length).toBe(4)
    })
  })
})