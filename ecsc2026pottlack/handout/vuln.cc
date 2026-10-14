#include <iostream>
#include <format>

// this is the reference implementation of std::hive for c++26. I got it from here: https://github.com/mattreecebentley/plf_hive
#include "plf_hive.h"

// bees are just size_t lol
typedef size_t bee;
using std::cout, std::endl, std::flush, std::cin, std::format;

// I got the hive from this guy: https://asciiart.website/artist.php?artist_id=4
static const char banner[] = 
"    ^^      .-=-=-=-.  ^^\n"
"^^        (`-=-=-=-=-`)         ^^\n"
"        (`-=-=-=-=-=-=-`)  ^^         ^^\n"
"  ^^   (`-=-=-=-=-=-=-=-`)   ^^                            ^^\n"
"      ( `-=-=-=-(@)-=-=-` )      ^^\n"
"      (`-=-=-=-=-=-=-=-=-`)  ^^\n"
"      (`-=-=-=-=-=-=-=-=-`)              ^^\n"
"      (`-=-=-=-=-=-=-=-=-`)                      ^^\n"
"      (`-=-=-=-=-=-=-=-=-`)  ^^\n"
"       (`-=-=-=-=-=-=-=-`)          ^^\n"
"        (`-=-=-=-=-=-=-`)  ^^                 ^^\n"
"          (`-=-=-=-=-`)\n"
"           `-=-=-=-=-`\n"
"\n";
struct banner_container {
  char * ptr;
};

void menu() {
  cout << "All the things you can do with bees:\n";
  cout << " 1. add a new bee\n";
  cout << " 2. erase a bee D:\n";
  cout << " 3. print a bee\n";
  cout << " 4. customize a bee\n";
  cout << " 5. list all the bees\n";
  cout << " 6. get a bee iterator\n";
  cout << " 7. advance the bee iterator\n";
  cout << " 8. quit\n";
  cout << "\n";
  cout.flush();
}

int input() {
  int choice{0};
  cout << "> " << flush;
  cin >> choice;
  return choice;
};

int main(void) {
  plf::hive<bee> hive;
  plf::hive<bee>::iterator it{};
  bee cur_bee{0};
  bool has_erased{0};
  // thank me later
  auto * b = new banner_container{(char*)banner};
  cout << b->ptr << flush;
  menu();
  while (cin.good()) {
    int choice = input();
    switch (choice) {
      case 1:
        cout << "enter your bee: " << flush;
        cin >> cur_bee;
        hive.emplace(cur_bee);
        break;
      case 2:
        if (!has_erased) {
          cout << format("the bee: {} has been erased", *it) << endl;
          hive.erase(it);
          has_erased = 1;
        } else {
          cout << "bees are an endangered species,\n the bee police has put you in jail and you can no longer harm the bees." << endl;
        }
        break;
      case 3:
        cout << format("the bee you requested is: {}", *it) << endl;
        break;
      case 4:
        cout << "enter the new bee: " << flush;
        cin >> cur_bee;
        *it = cur_bee;
        break;
      case 5:
        cout << "The bees currently in the hive:" << endl;
        for (const bee& bee : hive)
          cout << format(" - {}", bee) << endl;
        break;
      case 6:
        it = hive.begin();
        break;
      case 7:
        it++;
        break;
      case 8:
        delete b;
        return 0;
      default:
        cout << "Unknown Option." << endl;
        break;
    }
  }
  delete b;
  return 0;
}
