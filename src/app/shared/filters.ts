export class Filters{
  public goalsCopy:any[]=[];
  public filteredGoals: any[];
  public filteredInitiatives: any[];
  public filteredActivities: any[];
  public filteredOpis: any[];
  public goals:any[]=[];

  constructor(){
    
  }

  public initFilters(goalsCopy:any[]){
    // this.filteredGoals = this.filteredActivities = this.filteredInitiatives = this.filteredOpis = goalsCopy;
  }

  public searchGoal(key: any) {
    this.goals = this.goalsCopy;
    let val = key.target.value;
    if (val && val.trim() != '') {
      this.goals = this.goalsCopy.filter((item: any) => {
        return (item.goal.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      this.filteredGoals = this.goals;
    }
  }

























  public searchInitiative(key: any) {
    this.goals = JSON.parse(JSON.stringify(this.filteredGoals));
    let val = key.target.value;
    if (val && val.trim() != '') {
      this.goals = this.goals.filter((outerItem: any) => {
        outerItem.initiatives = outerItem.initiatives.filter((item: any) => {
          return (item.initiative.toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
        this.filteredInitiatives = this.goals;
        return outerItem.initiatives.length;
      });
    }
  }

  public searchActivity(key: any) {
    this.goals = JSON.parse(JSON.stringify(this.filteredInitiatives));
    let val = key.target.value;
    if (val && val.trim() != '') {
      this.goals = this.goals.filter((outerItem: any) => {
        outerItem.initiatives = outerItem.initiatives.filter((innerItem: any) => {
          innerItem.activities = innerItem.activities.filter((item: any) => {
            return (item.activity.toLowerCase().indexOf(val.toLowerCase()) > -1);
          });
          return innerItem.activities.length;
        });
        this.filteredActivities = this.goals;
        return outerItem.initiatives.length;
      });
    }
  }

  public searchOpi(key: any) {
    this.goals = JSON.parse(JSON.stringify(this.filteredActivities));
    let val = key.target.value;
    if (val && val.trim() != '') {
      this.goals = this.goals.filter((outerItem: any) => {
        outerItem.initiatives = outerItem.initiatives.filter((innerItem: any) => {
          innerItem.activities = innerItem.activities.filter((item: any) => {
            item.opis = item.opis.filter((inItem: any) => {
              return (inItem.opi.toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
            return item.opis.length;
          });
          return innerItem.activities.length;
        });
        return outerItem.initiatives.length;
      });
    }
  }
}